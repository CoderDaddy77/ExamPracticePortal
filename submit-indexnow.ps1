$body = @{
  host        = "exam-practice-portal.web.app"
  key         = "19bf0ffff60c42d5b6f51d2afa7a9c44"
  keyLocation = "https://exam-practice-portal.web.app/19bf0ffff60c42d5b6f51d2afa7a9c44.txt"
  urlList     = @(
    "https://exam-practice-portal.web.app/",
    "https://exam-practice-portal.web.app/study",
    "https://exam-practice-portal.web.app/about",
    "https://exam-practice-portal.web.app/exam/cuet",
    "https://exam-practice-portal.web.app/exam/cuet/physics",
    "https://exam-practice-portal.web.app/exam/cuet/physics/electrostatics/phy-ch1-potential",
    "https://exam-practice-portal.web.app/exam/cuet/physics/electrostatics/phy-ch1-easy",
    "https://exam-practice-portal.web.app/exam/cuet/physics/electrostatics/test-1773155087464",
    "https://exam-practice-portal.web.app/exam/cuet/physics/electrostatics/test-1770477504213",
    "https://exam-practice-portal.web.app/exam/cuet/chemistry",
    "https://exam-practice-portal.web.app/exam/cuet/chemistry/chem-test-1",
    "https://exam-practice-portal.web.app/exam/cuet/mathematics",
    "https://exam-practice-portal.web.app/exam/cuet/mathematics/algebra/math-test-1",
    "https://exam-practice-portal.web.app/exam/cuet/english",
    "https://exam-practice-portal.web.app/exam/cuet/gat",
    "https://exam-practice-portal.web.app/exam/ssc-chsl",
    "https://exam-practice-portal.web.app/exam/ssc-chsl/general-awareness",
    "https://exam-practice-portal.web.app/exam/ssc-chsl/general-awareness/test-1",
    "https://exam-practice-portal.web.app/exam/ssc-chsl/quantitative-aptitude",
    "https://exam-practice-portal.web.app/exam/ssc-chsl/quantitative-aptitude/test-2",
    "https://exam-practice-portal.web.app/exam/ssc-chsl/english",
    "https://exam-practice-portal.web.app/exam/ssc-chsl/reasoning",
    "https://exam-practice-portal.web.app/exam/ukssc",
    "https://exam-practice-portal.web.app/exam/gk",
    "https://exam-practice-portal.web.app/exam/current-affairs",
    "https://exam-practice-portal.web.app/exam/reasoning"
  )
} | ConvertTo-Json -Depth 3

Write-Host "Submitting 26 URLs to IndexNow (Bing)..." -ForegroundColor Cyan

$response = Invoke-WebRequest `
  -Uri "https://api.indexnow.org/IndexNow" `
  -Method POST `
  -ContentType "application/json; charset=utf-8" `
  -Body $body `
  -UseBasicParsing

Write-Host "Response Code: $($response.StatusCode)" -ForegroundColor Green

if ($response.StatusCode -eq 200) {
  Write-Host "SUCCESS! All 26 URLs submitted to Bing IndexNow!" -ForegroundColor Green
  Write-Host "Bing will crawl and index your pages within minutes." -ForegroundColor Yellow
} else {
  Write-Host "Response: $($response.Content)" -ForegroundColor Red
}
