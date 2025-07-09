--[[
    Example Usage of Roblox Script Security Monitor
    This script demonstrates how to use the monitor and shows what it detects
]]--

-- First, load the security monitor
-- (In practice, you would require/load the main script file)

print("=== SECURITY MONITOR DEMO ===")
print("This example shows how the monitor detects various script activities")
print()

-- Example 1: Start monitoring
print("1. Starting security monitor...")
startSecurityMonitor()

wait(1)

-- Example 2: Simulate some normal activity
print("2. Performing normal game operations...")

-- This will be logged but not flagged as suspicious
local workspace = game:GetService("Workspace")
local players = game:GetService("Players")

wait(0.5)

-- Example 3: Simulate suspicious activity
print("3. Simulating suspicious activities (for demonstration)...")

-- This will trigger security alerts
local httpService = game:GetService("HttpService")  -- Flagged: HttpService access

-- Simulate loading external code (VERY SUSPICIOUS)
if loadstring then
    print("   - Detected loadstring capability (would be flagged)")
    -- We won't actually execute malicious code, just demonstrate detection
end

-- Simulate require with HTTP (suspicious pattern)
print("   - Simulating suspicious require pattern...")

wait(0.5)

-- Example 4: Check current status
print("4. Checking monitor status...")
local status = getMonitorStatus()
print("   Monitoring active:", status.isMonitoring)
print("   Scripts discovered:", status.scriptsDiscovered)
print("   Function calls logged:", status.functionCallsLogged)
print("   Security alerts:", status.securityAlerts)

wait(1)

-- Example 5: Generate report while monitoring
print("5. Generating intermediate report...")
generateSecurityReport()

wait(1)

-- Example 6: Stop monitoring and get final report
print("6. Stopping monitor and generating final report...")
stopSecurityMonitor()

print()
print("=== DEMO COMPLETE ===")
print("The monitor has demonstrated:")
print("- Real-time script monitoring")
print("- Suspicious pattern detection") 
print("- Comprehensive reporting")
print("- Security alert generation")
print()
print("In a real scenario, this would help you:")
print("- Identify malicious scripts in your game")
print("- Understand what exploits are doing")
print("- Patch security vulnerabilities")
print("- Protect your players and game integrity")