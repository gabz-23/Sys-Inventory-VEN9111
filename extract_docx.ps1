Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('modelo.docx')
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$matches = [regex]::Matches($xml, '<w:t[^>]*>([^<]+)</w:t>')
$result = ($matches | ForEach-Object { $_.Groups[1].Value }) -join ''
Write-Output $result
