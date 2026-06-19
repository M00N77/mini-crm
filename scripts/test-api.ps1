$BASE = "http://localhost:3000"
$pass = 0
$fail = 0

function Test-Request($name, $method, $url, $body, $token) {
    $headers = @{ "Content-Type" = "application/json" }
    if ($token) { $headers["Authorization"] = "Bearer $token" }

    try {
        if ($body) {
            $bodyJson = $body | ConvertTo-Json -Compress
            $r = Invoke-RestMethod -Method $method -Uri "$BASE$url" -Headers $headers -Body $bodyJson
        } else {
            $r = Invoke-RestMethod -Method $method -Uri "$BASE$url" -Headers $headers
        }
        Write-Host "  PASS $name" -ForegroundColor Green
        $script:pass++
        return $r
    } catch {
        Write-Host "  FAIL $name : $_" -ForegroundColor Red
        $script:fail++
        return $null
    }
}

Write-Host "=== API Tests ===" -ForegroundColor Cyan

# 1. Register
Write-Host "`n[1] Register" -ForegroundColor Yellow
$regBody = @{ email = "test-api@mail.ru"; password = "123456"; name = "Test API" }
$reg = Test-Request "POST /auth/register" "POST" "/auth/register" $regBody

# 2. Login
Write-Host "`n[2] Login" -ForegroundColor Yellow
$loginBody = @{ email = "test-api@mail.ru"; password = "123456" }
$login = Test-Request "POST /auth/login" "POST" "/auth/login" $loginBody
$token = if ($login) { $login.accessToken } else { $null }
$refreshToken = if ($login) { $login.refreshToken } else { $null }

# 3. Get users
Write-Host "`n[3] Get users" -ForegroundColor Yellow
Test-Request "GET /users" "GET" "/users" $null $token

# 4. Create contact
Write-Host "`n[4] Create contact" -ForegroundColor Yellow
$contactBody = @{ name = "Ivan Ivanov"; email = "ivan@mail.ru"; phone = "+79991234567" }
$contact = Test-Request "POST /contacts" "POST" "/contacts" $contactBody $token

# 5. Get contacts
Write-Host "`n[5] Get contacts" -ForegroundColor Yellow
Test-Request "GET /contacts" "GET" "/contacts" $null $token

# 6. Create task
Write-Host "`n[6] Create task" -ForegroundColor Yellow
$taskBody = @{ title = "Test task"; description = "Testing API"; status = "pending" }
$task = Test-Request "POST /tasks" "POST" "/tasks" $taskBody $token

# 7. Get tasks
Write-Host "`n[7] Get tasks" -ForegroundColor Yellow
Test-Request "GET /tasks" "GET" "/tasks" $null $token

# 8. Refresh token
Write-Host "`n[8] Refresh token" -ForegroundColor Yellow
if ($refreshToken) {
    $refreshBody = @{ refreshToken = $refreshToken }
    Test-Request "POST /auth/refresh" "POST" "/auth/refresh" $refreshBody $null
} else {
    Write-Host "  SKIP (no refresh token)" -ForegroundColor Gray
}

Write-Host "`n=== Results ===" -ForegroundColor Cyan
Write-Host "Passed: $pass" -ForegroundColor Green
Write-Host "Failed: $fail" -ForegroundColor Red

if ($fail -eq 0) { Write-Host "All tests passed!" -ForegroundColor Green }
