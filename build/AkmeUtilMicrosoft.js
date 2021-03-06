/**
 * AKME utilities requiring Microsoft Scripting JScript extensions to Javascript.
 * e.g. for Scripting.FileSystemObject, Scripting.Dictionary, WScript.Shell, WMI
 */

//In HTA: <script type="text/vbscript">Function AkmeGetObject(str) Set AkmeGetObject = GetObject(str) End Function</script>
if (typeof this.GetObject != "function") this.GetObject = function(str){ return AkmeGetObject(str); };

var AkmeMS = {
 errPathNotFound : -2146828212,
 errFileNotFound : -2147024894,
 
 fsoRead : 1,
 fsoWrite : 2,
 fsoAppend : 8,
 fsoAscii : false,
 fsoUnicode : true,
 
 popOk : 0,
 popOkCancel : 1,
 popAbortRetyIgnore : 2,
 popYesNoCancel : 3,
 popYesNo : 4,
 popRetryCancel : 5,
 popStopIcon : 16,
 popQuestionIcon : 32,
 popExclamationIcon : 48,
 popInformationIcon : 64,
 
 ssfBitBucket : 10, // The recycle bin.
 ssfCommonAppData : 35,
 ssfCommonDesktopDir : 25,
 ssfCommonStartMenu : 22,
 ssfDesktop : 0, // The actual desktop, not the folder.
 ssfDesktopDir : 16,
 ssfLocalAppData : 28,
 ssfInternetCache : 32,
 ssfProfile : 40,
 ssfPrograms : 2, // The user Start Menu Programs.
 ssfProgramFiles : 38,
 ssfProgramFilesX86 : 48,
 ssfRoamingAppData : 26, // User roaming app data.
 ssfSystem : 37,
 ssfSystemX86 : 41,
 ssfWindows : 36,
 ssfTemp : -2, // Use non-standard number for TEMP directory.

 winHide : 0,
 winShow : 1,
 winMin : 2,
 winMax : 3,
 winInactive : 4,
 winActive : 5,
 winMinNext : 6,
 winMinInactive : 7,
 winMaxInactive : 8,
 winShowRestore : 9,
 winInherit : 10,
 
 winVer : null,
 
 wmiLogOff : 0,
 wmiShutdown : 1,
 wmiReboot : 2,
 wmiForced : 4, // add this with one of the other flags, e.g. 0+4
 wmiPowerOff : 8,
 
 // wmi.InstancesOf("...", this.wmiFast) or wmi.ExecQuery("SELECT * FROM ...", "WQL", this.wmiFast)
 wmiFast : 0x30, // 0x10 : wbemFlagReturnImmeidately + 0x20 : wbemFlagForwardOnly
 wmiTimeout : -2147209215,

 fso : new ActiveXObject("Scripting.FileSystemObject"),
 hta : typeof document === 'object' && (
        (document.documentMode == 8 && navigator.userAgent.indexOf("MSIE 7.") != -1) ||
        (document.documentMode > 8 && navigator.userAgent.indexOf("MSIE 7.") == -1 && typeof HTA.windowState != "undefined") ) ? 
	HTA : null,
 sha : new ActiveXObject("Shell.Application"),
 wsh : new ActiveXObject("WScript.Shell"),
 wmi : GetObject("winmgmts:{impersonationLevel=impersonate}!//./root/cimv2"),
 
 VB2JSArray : function (vbAry) {
  return new VBArray(vbAry).toArray();
 },
 
 JS2VBArray : function (jsAry) {
  var map = new ActiveXObject("Scripting.Dictionary");
  for (var i=0; i<jsAry.length; i++) map.add(i, jsAry[i]);
  var result = map.Items();
  map = null;
  return result;
 },
 
 IsVistaOrHigher : function () {
  if (this.winVer == null) this.winVer = wsh.RegRead("HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion");
  return (this.winVer >= 6.0);
 },

 IsElevated : function () { // S-1-5-19 is Local Service, a check for Admin/Elevation
  if (this.winElevated == null) try { wsh.RegRead("HKSUSERS\\S-1-5-19\\"); this.winElevated = true; } catch (er) { this.winElevated = false; }
  return this.winElevated;
 },
 
 IsCurrentUserAdmin : function () {
  // Only Administrators CanStartStopService("Schedule").
  // Vista requires special handling since no session has Administrative elevated rights by default.
  return this.IsVistaOrHigher() || this.sha.CanStartStopService("Schedule");
 },
 
 GetGroupWmi : function (domainName,groupName) {
  var comp = (domainName == ".") ? this.net.ComputerName : domainName;
  var wmi = GetObject("winmgmts:{impersonationLevel=impersonate}!//" + comp + "/root/cimv2");
  var result = wmi.Get("Win32_Group.Domain='"+ comp +"',Name='"+ groupName +"'");
  wmi = null;
  return result;
 },

 IsCurrentUserInGroupWmi : function (group) {
  if (!group) return false;
  var user = this.net.UserName;
  //alert( group.Path_ )
  // There may be both Users and Groups within Groups.
  for (var en = new Enumerator(group.Associators_("Win32_GroupUser","Win32_UserAccount")); !en.atEnd(); en.moveNext()) {
   var member = en.item();
   if (member.Name == user) return true;
  }
  for (var en = new Enumerator(group.Associators_("Win32_GroupUser","Win32_Group")); !en.atEnd(); en.moveNext()) {
   if (this.IsCurrentUserInGroupWmi(en.item())) return true;
  }
  return false;
 },

 GetTempFilename : function (ext) {
  return this.GetSpecialFolder(this.ssfTemp).Path +'\\'+ this.fso.GetTempName() + ((ext) ? ext : "");
 },

 GetFolderPath : function (name) {
  return this.fso.GetFolder(name).Path;
 },
 
 GetSpecialFolder : function (nameOrId) {
  if (parseInt(nameOrId) === nameOrId) {
   // fso.GetSpecialFolder(#) // # 0=Windows, 1=System, 2=Temp
   if (nameOrId === this.ssfTemp) return this.fso.GetSpecialFolder(2);
   else return this.sha.NameSpace(nameOrId).Self.Path;
  }
 },
 
 GetXmlHttpRequest : function () {
  return new ActiveXObject("Msxml2.XMLHTTP.6.0");
 },
 
 GetServerXmlHttpRequest : function () {
  return new ActiveXObject("Msxml2.ServerXMLHTTP.6.0");
 },
 
 DoEvents : function () {
  return this.wsh.Run('subst.exe >nul:', 0, true);
 },

 Sleep : function (millis) {
  // __InstanceCreationEvent, __InstanceModificationEvent, __InstanceDeletionEvent 
  // __InstanceOperationEvent, __MethodInvocationEvent, __Event, __TimerEvent
  // Wait for an impossible WMI event with a timeout.
  var mon = this.wmi.ExecNotificationQuery("SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE TargetInstance ISA 'Win32_ComputerSystem'");
  try { mon.NextEvent(millis); } // var ev = ...
  catch (er) { if (er.number != this.wmiTimeout) throw er; }
 },
 
 ShellExecute : function (executableName, vArgs, vDir, vOperation, vShow) {
  this.sha.ShellExecute(executableName, vArgs, vDir, vOperation, vShow);
 },
 
 CreateProcess : function (cmd, startPath, winStyle, priority, title, width, height) {
  var startup = this.wmi.Get("Win32_ProcessStartup");
  var config = startup.SpawnInstance_();
  if (typeof winStyle != "undefined") config.ShowWindow = winStyle;
  if (typeof priority != "undefined") config.PriorityClass = priority;
  if (typeof width != "undefined") config.XSize = width;
  if (typeof height != "undefined") config.YSize = height;
  var process = this.wmi.Get("Win32_Process");
  var inp = process.Methods_("Create").InParameters.SpawnInstance_();
  inp.CommandLine = cmd;
  inp.CurrentDirectory = startPath;
  inp.ProcessStartupInformation = config;
  oup = this.wmi.ExecMethod("Win32_Process", "Create", inp);
  var err = oup.ReturnValue;
  var pid = oup.ProcessId;
  return [err, pid];
 },
 
 DestroyProcess : function (pid) {
  var coll = this.wmi.InstancesOf("Win32_Process", this.wmiFast);
  for (var en=new Enumerator(coll); !en.atEnd(); en.moveNext()) {
   var item = en.item();
   if (item.ProcessId == pid) {
    AkmeMS.DebugNoLine("Terminate PID "+ pid +" ... ");
    try { item.Terminate(); AkmeMS.Debug("OK"); return true; }
	catch (ex) { AkmeMS.Debug(new AkmeErr(ex).format("ER")); return false; }
   }
  }
 },
 
 Reboot : function () {
  this.Win32Shutdown(this.wmiReboot);
 },
 
 Shutdown : function () {
  this.Win32Shutdown(this.wmiShutdown);
 },
 
 Win32Shutdown : function (computerName, flags) {
  var wmr = GetObject("winmgmts:{impersonationLevel=impersonate,(RemoteShutdown)}!//" +
   computerName + "/root/cimv2");
  for (var en = new Enumerator(wmr.InstancesOf("Win32_OperatingSystem")); 
    !en.atEnd(); en.moveNext()) {
   if (flags == 1) {
    return en.item().Shutdown();
   } else if (flags == 2) {
    return en.item().Reboot();
   } else if (flags) {
    return en.item().Win32Shutdown(flags, 0);
   }
  }
 },
  
 Popup : function (sText,nSecondsToWait,sTitle,nType) {
  this.wsh.Popup(sText,nSecondsToWait,sTitle,nType);
 },
 
 Debug : function (str) {
  if (typeof(window)!="undefined") {
   var form = window.document.forms['debug'];
   if (form && form.elements['log']) form.elements['log'].value += str +"\r\n";
   else window.alert(str);
  }
 },
  
 // e.g. ("%ProgramFiles%\\AF TIMS 5\\Update\\curl.exe", "curl URL Transfer")
 AddFirewallAuthorizeApplication : function (fileName, displayName) {
  var NET_FW_PROFILE_DOMAIN = 0;
  var NET_FW_PROFILE_STANDARD = 1;
  var NET_FW_SCOPE_ALL = 0;
  var NET_FW_IP_VERSION_ANY = 2;
  var errCodeDescName = [0,"OK",""];
  var fwm;
  var app;
  var prf;
  try {
   fwm = new ActiveXObject("HNetCfg.FwMgr");
   app = new ActiveXObject("HNetCfg.FwAuthorizedApplication");
   prf = fwm.LocalPolicy.CurrentProfile;
   app.ProcessImageFileName = fileName;
   app.Name = displayName;
   app.Scope = NET_FW_SCOPE_ALL;
   app.IpVersion = NET_FW_IP_VERSION_ANY;
   app.Enabled = true;
   prf.AuthorizedApplications.Add( app );
  }
  catch (ex) {
   errCodeDescName = [ex.number,ex.description,ex.name];
  } finally {
   prf = null;
   app = null;
   fwm = null;
  }
  return errCodeDescName;
 }

} // AkmeMS


// Remember the error number and description.
function AkmeErr(ex) {
 this.prefix = "";
 this.suffix = "";
 this.set = function (ex) {
  this.number = (ex) ? ex.number : 0;
  this.description = (ex) ? String(ex.description).replace(/[\r\n]/g," ") : "";
 };
 this.set(ex);
 this.format = function (prefix,suffix) {
  return (prefix ? prefix : this.prefix) +" ("+ this.number +") "+ this.description +" "+ (suffix ? suffix : this.suffix);
 };
 return this;
}


// Abstraction from WSH or MSI scripting containers.  
// Could extend to HTA or IE hosted scripts.
var AkmeScriptingHost = {
 _hta : typeof(window) != "undefined" ? window : null,
 _mis : typeof(Session) != "undefined" ? Session : null,
 _msi : typeof(Installer) != "undefined" ? Installer : null,
 _wsh : typeof(WScript) != "undefined" ? WScript : null,
 
 Init : function() {
  this.Debug("DateTime "+ new Date());
  this.Debug("CDir "+ this.CurrentDirectory());
  this.Debug("OS "+ this.Environment("OS"));
  this.Debug("HOME "+ this.Environment("HOMEDRIVE") + this.Environment("HOMEPATH"));
  this.Debug("TEMP "+ this.Environment("TEMP"));
  this.Debug("COMSPEC "+ this.Environment("COMSPEC"));
  this.Debug("ScriptEngine "+ this.ScriptEngine);
  if (this._msi != null) {
   this.Debug("Installer.Version "+ _msi.Version);
   this.Debug("Installer.UILevel "+ _msi.UILevel);
  }
  if (this._msi != null) {
   this.Debug("Session.Language "+ _mis.Language);
   this.Debug("Session.SourceDir "+ _mis.Property("SourceDir"));
   this.Debug("Session.TARGETDIR "+ _mis.Property("TARGETDIR"));
   this.Debug("Session.INSTALLDIR "+ _mis.Property("INSTALLDIR"));
  }
  if (this._wsh != null) {
   this.Debug("Version "+ this._wsh.Version);
   this.Debug("BuildVersion "+ this._wsh.BuildVersion);
   this.Debug("ScriptName "+ this._wsh.ScriptName);
   this.Debug("ScriptFullName "+ this._wsh.ScriptFullName);
  }
 },
 
 IsHta : this._hta != null,
 IsMis : this._mis != null,
 IsMsi : this._msi != null,
 IsWsh : this._wsh != null,

 GetTimeString : function() {
  var dt = new Date();
  return String(100+dt.getHours()).substring(1) 
   +":"+ String(100+dt.getMinutes()).substring(1) 
   +":"+ String(100+dt.getSeconds()).substring(1);
 },

 Debug : function(txt) {
  var rec, msiMessageTypeInfo = 0x04000000;
  if (this.IsHta) {
   this._hta.alert("Debug "+ ": "+ txt);
  } else if (this.IsWsh) {
   this._wsh.Echo("Debug "+ this.GetTimeString() +": "+ txt);
  } else if (this.IsMis) {
   rec = this._msi.CreateRecord( 1 );
   rec.StringData(0) = "Debug [Time]: [1]";
   rec.StringData(1) = txt;
   this._mis.Message(msiMessageTypeInfo, rec);
   rec = null;
  }
 },

 GetOrNewInstaller : function() {
  if (this._msi == null) {
   this._msi = new ActiveXObject("WindowsInstaller.Installer");
  }
  return this._msi
 },
    
 CurrentDirectory : function() {
  var fs = AkmeMS.fso;
  var r = fs.GetFolder(".").Path;
  fs = null;
  return r;
 },

 Environment : function(name) {
  if (this.IsMsi) {
   return this._msi.Environment(name);
  } else {
   var sh = AkmeMS.wsh;
   return sh.Environment("PROCESS")(name);
  }
 }

}
AkmeScriptingHost.Init();


// Encoder/Decoder for Url and Property encodings for maps of name/value pairs.
//
function EncodedMap() {
 this.Map = {};
 this.Exists = function(key) { return (this.Map[key]) != "undefined" };
 this.Add = function(key,val) { this.Map[key] = val; };
 this.AddAll = function(map) { for (var key in map) { this.Map[key] = map[key]; } };
 this.AddAllKeysValues = function(keys,values) { for (var key in keys) { this.Map[key] = values[key]; } };
 this.Remove = function(key) { var r = this.Map[key]; delete this.Map[key]; return r; };
 this.RemoveAll = function() { for (var key in this.Map) delete this.Map[key]; }; 

 this.UrlEncode = function() { // return String
  var ary1 = [], ary2 = new Array(2), idx1;
  idx1 = 0;
  for (var key in this.Map) {
   ary2[0] = key ; ary2[1] = this.Map[key]; //: debug( ary2(0) &" "& ary2(1) )
   if (ary2[1] == "undefined" || ary2[1] == "unknown") { ary2[1] = ""; }
   for (var i=0; i<ary2.length; i++) {
    ary2[i] = escape(ary2[i]).replace(/\+/g,"%2B");
   }
   ary1[idx1] = ary2[0] +"="+ ary2[1];
   idx1++;
  }
  return ary1.join("&");
 };
    
 this.UrlDecode = function(paramStr) {
  var str, ary1, ary2;
  str = String(paramStr).replace(/\+/g," ");
  ary1 = str.split("&");
  for (var j=0; j<ary1.length; j++) {
   ary2 = ary1[j].split("=");
   for (var i=0; i<ary2.length; i++) {
    ary2[i] = unescape(ary2[i]);
   }
   this.Map[ary2[0]] = ary2[1];
  }
 };

 this.PropertyEncode = function() { // return String
  var ary1 = new Array(this.Map.length), ary2 = new Array(2), idx1;
  idx1 = 0;
  for (var key in this.Map) {
   ary2[0] = key ; ary2[1] = this.Map[key];
   if (ary2[1] == "undefined" || ary2[1] == "unknown") { ary2[1] = ""; }
   for (var i=0; i<ary2.length; i++) {
    ary2[i] = ary2[i].replace("\n", "\\\n");
   }
   ary1[idx1] = ary2[0] +"="+ ary2[1];
   idx1++;
  }
  return ary1.join("\r\n");
 };
    
 this.PropertyDecode = function(paramStr) {
  var str, ary1, ary2;
  str = String(paramStr);
  this.Map = [];
  ary1 = str.split("\r\n");
  for (var item in ary1) {
   ary2 = item.split("=");
   this.Map[ary2[0]] = ary2[1].replace("\\\n","\n");
  }
 };

 return this;
}


// IniFile manipulation using FileSystemObject text lines.
// The FileName is to set/get the INI file name. 
// The Map is a map of "[section]item" keys to related values.
// The private lnList_ remembers the order of lines including comments.
// The private newMap_ remembers newly added elements to add to the stream when saving.
function AkmeIniFile() {

    // private
    this.fs_ = AkmeMS.fso;
    this.lnList_ = null;
    this.newMap_ = {};

    // public
    this.FileName = "";
    this.Map = {};

    this.GetString = function ( sectionName, keyName ) {
    	if (this.lnList_ === null) {
    		this.LoadMap();
    	}
    	var infoKey = "["+ sectionName +"]"+ keyName
    	if (this.Map[infoKey]) {
    		return this.Map[infoKey];
    	} else {
    		return null;
    	}
	};
    
    this.SetString = function( sectionName, keyName, value ) {
    	var infoKey = "["+ sectionName +"]"+ keyName;
    	if (this.lnList_ === null) {
    		this.LoadMap();
    	}
    	if (!this.Map[infoKey] && !this.newMap_[infoKey]) {
			this.newMap_[infoKey] = true;
			var sec, found;
			sec = "["+ sectionName +"]";
			found = false;
			for (var i=0; i<this.lnList_.length; i++) {
				if (this.lnList_[i].indexOf(sec) != 0) continue;
				found = true;
				break;
			}
			if (!found) {
				this.lnList_.splice(this.lnList_.length, 0, "", sec);
			}
    	}
    	this.Map[infoKey] = value;
    };
    
    this.ReadString = function( sectionName, keyName, defValue ) { // Return As String
    	var result = this.GetString( sectionName, keyName )
    	if (!(result > "")) result = defValue;
		return result;
    };

    this.WriteString = function( sectionName, keyName, value ) {
    	this.SetString( sectionName, keyName, value );
    	this.SaveMap();
    };

    this.LoadMap = function() {
    	if (!this.fs_.FileExists(this.FileName)) {
    		AkmeMS.Debug("IniFileLines.LoadMap() cannot find "+ this.FileName);
    		return;
    	}
    	var ts, str, c, pos, sec, key, infoKey, oldCount;
		oldCount = 0;
		for (var key in this.Map) { oldCount = 1 ; break; }
    	this.lnList_ = [];
    	this.newMap_ = {};
    	ts = this.fs_.OpenTextFile(this.FileName, 1);
    	while (!ts.AtEndOfStream) {
    		key = null;
    		str = ts.ReadLine();
    		c = str.charAt(0);
    		if (c === "[") {
    			pos = str.lastIndexOf("]");
    			sec = str.substring(1,pos);
    		} else if ((c >= "0" && c <= "9") || (c >= "A" && c <= "Z") || (c >= "a" && c <= "z")) {
    			pos = str.indexOf("=");
    			if (pos >= 0) {
    			key = str.substring(0,pos).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    			infoKey = "["+ sec +"]"+ key;
				this.newMap_[infoKey] = false;
    			if (oldCount === 0 || typeof(this.Map[infoKey]) != 'undefined') {
					this.Map[infoKey] = str.substring(pos+1).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    			}
    			}
     		}
    		this.lnList_[this.lnList_.length] = str;
    	}
    	ts.Close();
    	ts = null;
		for (var key in this.Map) {
			if (typeof(this.newMap_[key]) == 'undefined') this.newMap_[key] = true;
		}
    };

    this.SaveMap = function() {
    	if (!this.fs_.FileExists(this.FileName)) {
    		AkmeMS.Debug("IniFileLines.SaveMap() cannot find "+ this.FileName);
    		return;
    	}
    	var ts, str, c, pos, sec, key, i, j, infoKey;
    	ts = this.fs_.OpenTextFile(this.FileName, 2);
    	// Using a while loop since the length may change.
    	i = 0;
    	while (i < this.lnList_.length) {
    		key = null;
    		str = this.lnList_[i];
    		c = (str) ? str.charAt(0) : "";
    		if (c === "[") {
    			pos = str.lastIndexOf("]");
    			sec = str.substring(1,pos);
    			j = 1;
    			for (var infoKey in this.newMap_) { 
    			if (this.newMap_[infoKey] && str.lastIndexOf(infoKey.substring(0,pos+1), pos+1) === 0) {
    				this.lnList_.splice(i+j, 0, infoKey.substring(pos+1) +"=");
    				j = j + 1;
    			}
    			}
    		} else if ((c >= "0" && c <= "9") || (c >= "A" && c <= "Z") || (c >= "a" && c <= "z")) {
    			pos = str.indexOf("=");
    			if (pos >= 0) {
    				key = str.substring(0,pos).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    			}
     		}
			infoKey = "";
			if (key != null) {
	     		infoKey = "["+ sec +"]"+ key;
				if (this.newMap_[infoKey]) {
					// It can only be new once, ignore duplicates.
					if (this.newMap_[infoKey]) this.newMap_[infoKey] = false;
				} 
				if (typeof(this.Map[infoKey]) != 'undefined') {
	     			str = key +"="+ this.Map[infoKey];
	     			this.lnList_[i] = str;
				} else {
					infoKey = null;
				}
			}
			if (infoKey != null) ts.WriteLine(str);
     		i = i + 1;
    	}
    	ts.Close();
    	ts = null;
    	this.newMap_ = {};
    };

}


