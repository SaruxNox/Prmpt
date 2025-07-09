--[[
    Roblox Script Security Monitor
    Version: 1.0
    Purpose: Monitor and analyze scripts for security research and vulnerability patching
    
    DISCLAIMER: This tool is intended for legitimate security research and defensive purposes only.
    Use this responsibly to protect your Roblox games and understand potential security threats.
]]--

local ScriptMonitor = {}
ScriptMonitor.__index = ScriptMonitor

-- Configuration
local CONFIG = {
    MAX_LOG_ENTRIES = 1000,
    MONITOR_INTERVAL = 0.1,
    CAPTURE_FUNCTIONS = true,
    CAPTURE_REMOTES = true,
    CAPTURE_PROPERTIES = true,
    LOG_FILE_NAME = "script_monitor_log.txt",
    ALERT_SUSPICIOUS = true
}

-- Storage for monitored data
local monitorData = {
    scripts = {},
    functionCalls = {},
    remoteEvents = {},
    propertyChanges = {},
    suspiciousActivity = {},
    startTime = tick(),
    isMonitoring = false
}

-- Suspicious patterns to watch for
local SUSPICIOUS_PATTERNS = {
    "require%(.*http",
    "loadstring",
    "getfenv",
    "setfenv",
    "debug%..*",
    "coroutine%.wrap",
    "spawn%(",
    "HttpService",
    "TeleportService",
    "MarketplaceService",
    "game%.HttpGet",
    "game%.HttpPost",
    "game%.GetService%(.+HttpService",
    "LocalPlayer%.Character%.Humanoid",
    "LocalPlayer%.Character%.HumanoidRootPart",
    "workspace%.CurrentCamera",
    "UserInputService",
    "ContextActionService"
}

-- Initialize the monitor
function ScriptMonitor.new()
    local self = setmetatable({}, ScriptMonitor)
    self.originalFunctions = {}
    self.hookedFunctions = {}
    return self
end

-- Hook into common Roblox functions
function ScriptMonitor:setupHooks()
    local game = game or {}
    local workspace = workspace or {}
    
    -- Hook GetService calls
    if game.GetService then
        self.originalFunctions.GetService = game.GetService
        game.GetService = function(self, serviceName)
            ScriptMonitor:logActivity("GetService", {
                service = serviceName,
                timestamp = tick(),
                source = debug.getinfo(2, "S").source or "unknown"
            })
            return self.originalFunctions.GetService(self, serviceName)
        end
    end
    
    -- Hook require function
    if _G.require then
        self.originalFunctions.require = _G.require
        _G.require = function(moduleId)
            ScriptMonitor:logActivity("require", {
                moduleId = moduleId,
                timestamp = tick(),
                source = debug.getinfo(2, "S").source or "unknown"
            })
            return self.originalFunctions.require(moduleId)
        end
    end
    
    -- Hook loadstring (highly suspicious)
    if _G.loadstring then
        self.originalFunctions.loadstring = _G.loadstring
        _G.loadstring = function(code)
            ScriptMonitor:logActivity("loadstring", {
                code = code,
                timestamp = tick(),
                source = debug.getinfo(2, "S").source or "unknown",
                suspicious = true
            })
            ScriptMonitor:flagSuspicious("loadstring usage detected", code)
            return self.originalFunctions.loadstring(code)
        end
    end
end

-- Log activity
function ScriptMonitor:logActivity(activityType, data)
    if not monitorData.isMonitoring then return end
    
    local entry = {
        type = activityType,
        data = data,
        timestamp = tick(),
        script_source = debug.getinfo(3, "S").source or "unknown"
    }
    
    table.insert(monitorData.functionCalls, entry)
    
    -- Check for suspicious patterns
    if data.code then
        self:analyzeSuspiciousCode(data.code)
    end
    
    -- Limit log size
    if #monitorData.functionCalls > CONFIG.MAX_LOG_ENTRIES then
        table.remove(monitorData.functionCalls, 1)
    end
end

-- Analyze code for suspicious patterns
function ScriptMonitor:analyzeSuspiciousCode(code)
    if type(code) ~= "string" then return end
    
    for _, pattern in ipairs(SUSPICIOUS_PATTERNS) do
        if string.match(code, pattern) then
            self:flagSuspicious("Suspicious pattern detected: " .. pattern, code)
        end
    end
end

-- Flag suspicious activity
function ScriptMonitor:flagSuspicious(reason, details)
    local alert = {
        reason = reason,
        details = details,
        timestamp = tick(),
        source = debug.getinfo(3, "S").source or "unknown"
    }
    
    table.insert(monitorData.suspiciousActivity, alert)
    
    if CONFIG.ALERT_SUSPICIOUS then
        print("[SECURITY ALERT] " .. reason)
        if details then
            print("Details: " .. tostring(details))
        end
    end
end

-- Monitor running scripts
function ScriptMonitor:scanRunningScripts()
    if not game or not game.Workspace then return end
    
    local function scanContainer(container, containerName)
        for _, child in ipairs(container:GetChildren()) do
            if child:IsA("Script") or child:IsA("LocalScript") or child:IsA("ModuleScript") then
                local scriptInfo = {
                    name = child.Name,
                    className = child.ClassName,
                    parent = containerName,
                    source = child.Source or "No source available",
                    timestamp = tick(),
                    enabled = child.Enabled
                }
                
                -- Check if this is a new script
                local scriptId = containerName .. "/" .. child.Name
                if not monitorData.scripts[scriptId] then
                    monitorData.scripts[scriptId] = scriptInfo
                    self:analyzeScript(scriptInfo)
                end
            end
            
            -- Recursively scan children
            if child:GetChildren() then
                scanContainer(child, containerName .. "/" .. child.Name)
            end
        end
    end
    
    -- Scan workspace
    scanContainer(game.Workspace, "Workspace")
    
    -- Scan other important locations
    if game.ServerScriptService then
        scanContainer(game.ServerScriptService, "ServerScriptService")
    end
    
    if game.StarterPlayerScripts then
        scanContainer(game.StarterPlayerScripts, "StarterPlayerScripts")
    end
    
    if game.ReplicatedStorage then
        scanContainer(game.ReplicatedStorage, "ReplicatedStorage")
    end
end

-- Analyze individual script
function ScriptMonitor:analyzeScript(scriptInfo)
    if not scriptInfo.source then return end
    
    -- Check for suspicious patterns in script source
    self:analyzeSuspiciousCode(scriptInfo.source)
    
    -- Log script discovery
    self:logActivity("script_discovered", scriptInfo)
end

-- Start monitoring
function ScriptMonitor:startMonitoring()
    if monitorData.isMonitoring then
        print("Monitor is already running!")
        return
    end
    
    print("Starting Roblox Script Security Monitor...")
    print("Purpose: Monitoring for security research and vulnerability analysis")
    
    monitorData.isMonitoring = true
    monitorData.startTime = tick()
    
    -- Setup function hooks
    self:setupHooks()
    
    -- Start periodic scanning
    spawn(function()
        while monitorData.isMonitoring do
            self:scanRunningScripts()
            wait(CONFIG.MONITOR_INTERVAL)
        end
    end)
    
    print("Monitor started successfully!")
end

-- Stop monitoring
function ScriptMonitor:stopMonitoring()
    if not monitorData.isMonitoring then
        print("Monitor is not running!")
        return
    end
    
    print("Stopping monitor...")
    monitorData.isMonitoring = false
    
    -- Restore original functions
    if game and self.originalFunctions.GetService then
        game.GetService = self.originalFunctions.GetService
    end
    
    if self.originalFunctions.require then
        _G.require = self.originalFunctions.require
    end
    
    if self.originalFunctions.loadstring then
        _G.loadstring = self.originalFunctions.loadstring
    end
    
    print("Monitor stopped. Generating report...")
    self:generateReport()
end

-- Generate comprehensive report
function ScriptMonitor:generateReport()
    local report = {}
    local runTime = tick() - monitorData.startTime
    
    table.insert(report, "=== ROBLOX SCRIPT SECURITY MONITOR REPORT ===")
    table.insert(report, "Generated: " .. os.date())
    table.insert(report, "Monitoring Duration: " .. string.format("%.2f", runTime) .. " seconds")
    table.insert(report, "")
    
    -- Scripts discovered
    table.insert(report, "=== DISCOVERED SCRIPTS ===")
    local scriptCount = 0
    for scriptId, scriptInfo in pairs(monitorData.scripts) do
        scriptCount = scriptCount + 1
        table.insert(report, string.format("[%d] %s (%s)", scriptCount, scriptId, scriptInfo.className))
        table.insert(report, "  Enabled: " .. tostring(scriptInfo.enabled))
        if CONFIG.CAPTURE_FUNCTIONS and scriptInfo.source then
            table.insert(report, "  Source Preview: " .. string.sub(scriptInfo.source, 1, 100) .. "...")
        end
        table.insert(report, "")
    end
    
    -- Function calls
    table.insert(report, "=== FUNCTION CALL LOG ===")
    for i, call in ipairs(monitorData.functionCalls) do
        table.insert(report, string.format("[%d] %s at %.3f", i, call.type, call.timestamp))
        if call.data then
            for key, value in pairs(call.data) do
                table.insert(report, "  " .. key .. ": " .. tostring(value))
            end
        end
        table.insert(report, "")
    end
    
    -- Suspicious activity
    if #monitorData.suspiciousActivity > 0 then
        table.insert(report, "=== SECURITY ALERTS ===")
        for i, alert in ipairs(monitorData.suspiciousActivity) do
            table.insert(report, string.format("[ALERT %d] %s", i, alert.reason))
            table.insert(report, "  Time: " .. alert.timestamp)
            table.insert(report, "  Source: " .. alert.source)
            if alert.details then
                table.insert(report, "  Details: " .. tostring(alert.details))
            end
            table.insert(report, "")
        end
    else
        table.insert(report, "=== NO SECURITY ALERTS ===")
        table.insert(report, "No suspicious activity detected during monitoring session.")
        table.insert(report, "")
    end
    
    -- Summary
    table.insert(report, "=== SUMMARY ===")
    table.insert(report, "Scripts Discovered: " .. scriptCount)
    table.insert(report, "Function Calls Logged: " .. #monitorData.functionCalls)
    table.insert(report, "Security Alerts: " .. #monitorData.suspiciousActivity)
    table.insert(report, "")
    
    local reportText = table.concat(report, "\n")
    print(reportText)
    
    -- Try to save to file if possible
    if writefile then
        writefile(CONFIG.LOG_FILE_NAME, reportText)
        print("Report saved to: " .. CONFIG.LOG_FILE_NAME)
    end
    
    return reportText
end

-- Get current monitoring status
function ScriptMonitor:getStatus()
    return {
        isMonitoring = monitorData.isMonitoring,
        runtime = monitorData.isMonitoring and (tick() - monitorData.startTime) or 0,
        scriptsDiscovered = self:countScripts(),
        functionCallsLogged = #monitorData.functionCalls,
        securityAlerts = #monitorData.suspiciousActivity
    }
end

-- Count discovered scripts
function ScriptMonitor:countScripts()
    local count = 0
    for _ in pairs(monitorData.scripts) do
        count = count + 1
    end
    return count
end

-- Clear all monitoring data
function ScriptMonitor:clearData()
    monitorData.scripts = {}
    monitorData.functionCalls = {}
    monitorData.remoteEvents = {}
    monitorData.propertyChanges = {}
    monitorData.suspiciousActivity = {}
    print("Monitoring data cleared.")
end

-- Export API
local monitor = ScriptMonitor.new()

-- Global functions for easy use
_G.startSecurityMonitor = function()
    monitor:startMonitoring()
end

_G.stopSecurityMonitor = function()
    monitor:stopMonitoring()
end

_G.getMonitorStatus = function()
    return monitor:getStatus()
end

_G.clearMonitorData = function()
    monitor:clearData()
end

_G.generateSecurityReport = function()
    return monitor:generateReport()
end

-- Usage instructions
print([[
=== ROBLOX SCRIPT SECURITY MONITOR ===
LOADED SUCCESSFULLY!

Usage:
  startSecurityMonitor()     - Begin monitoring scripts
  stopSecurityMonitor()      - Stop monitoring and generate report
  getMonitorStatus()         - Check current monitoring status
  generateSecurityReport()   - Generate report without stopping
  clearMonitorData()         - Clear all collected data

Purpose: This tool helps developers identify and analyze potentially
malicious scripts for security research and vulnerability patching.

IMPORTANT: Use this tool responsibly and only for legitimate security
research purposes to protect your Roblox games.
]])

return ScriptMonitor