Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class WindowArrangement {
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
        
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
        
        [DllImport("user32.dll")]
        public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
        
        [StructLayout(LayoutKind.Sequential)]
        public struct RECT {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }
    }
"@

# Add System.Windows.Forms for screen information
Add-Type -AssemblyName System.Windows.Forms

# Get screen dimensions
$screenWidth = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea.Width
$screenHeight = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea.Height

# Define window titles to look for
$windowTitles = @(
    "user-service",
    "post-service",
    "party-service",
    "community-service",
    "api-gateway",
    "next-server",
    "frontend"
)

# Wait for windows to be created
Start-Sleep -Seconds 5

# Find all matching windows
$windows = @()
foreach ($title in $windowTitles) {
    $processes = Get-Process | Where-Object { $_.MainWindowTitle -like "*$title*" }
    foreach ($process in $processes) {
        if ($process.MainWindowHandle -ne 0) {
            $windows += @{
                Handle = $process.MainWindowHandle
                Title = $process.MainWindowTitle
            }
        }
    }
}

Write-Host "Found $($windows.Count) windows to arrange"

# Calculate grid layout
$count = $windows.Count
if ($count -eq 0) {
    Write-Host "No windows found to arrange"
    exit
}

# Calculate optimal grid dimensions
$cols = [Math]::Ceiling([Math]::Sqrt($count))
$rows = [Math]::Ceiling($count / $cols)

# Calculate window dimensions
$windowWidth = [Math]::Floor($screenWidth / $cols)
$windowHeight = [Math]::Floor($screenHeight / $rows)

Write-Host "Arranging in a $rows x $cols grid"

# Arrange windows
for ($i = 0; $i -lt $count; $i++) {
    $row = [Math]::Floor($i / $cols)
    $col = $i % $cols

    $x = $col * $windowWidth
    $y = $row * $windowHeight

    $window = $windows[$i]
    [WindowArrangement]::MoveWindow($window.Handle, $x, $y, $windowWidth, $windowHeight, $true) | Out-Null
    Write-Host "Positioned window: $($window.Title)"
}

Write-Host "Window arrangement complete"