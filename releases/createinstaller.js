const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath)

  return Promise.resolve({
    appDirectory: path.join(outPath, 'ESG Teacher Image Downloader-win32-ia32/'),
    authors: 'PseudoOutlandish',
    noMsi: true,
    outputDirectory: path.join(outPath, 'installer'),
    exe: 'ESG Teacher Image Downloader.exe',
    setupExe: 'esgdownloaderinstall.exe',
    setupIcon: path.join(rootPath, 'icons', 'setup.ico'),
	description: "ESG Teacher Image Downloader",
	title: "ESG Teacher Image Downloader",
	loadingGif: path.join(rootPath, 'icons', 'setup.gif'),
  })
}