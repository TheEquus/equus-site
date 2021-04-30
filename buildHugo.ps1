"Removing files (except .git ones of course) from public folder"
Get-ChildItem -Path ./public | Remove-Item -Verbose -Recurse -Confirm:$false
"Adding CNAME file"
Copy-Item './CNAME' './public/CNAME' 
"Rebuilding the hugo site"
hugo --minify
"All done!"
