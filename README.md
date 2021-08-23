# The Racing+ Mod

## Download & Additional Information

Please visit [the website for Racing+](https://isaacracing.net/) or [subscribe to the mod on the Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=857628390).

<br />

## Description

This is the Lua mod for Racing+, a Binding of Isaac: Afterbirth+ racing platform. Normally a single player game, the mod, client, and server allow players to be able to race each other in real time.

This mod is written using [IsaacScript](https://isaacscript.github.io/).

See also:
- [Mod changes](docs/changes.md)
- [Race formats](docs/race-formats.md)
- [Custom challenges](docs/challenges.md) (i.e. multi-character speedruns)
- [Version history](https://github.com/Zamiell/isaac-racing-client/blob/master/HISTORY.md)
- [Known bugs](docs/bugs.md)

You may also be interested in [the client repository](https://github.com/Zamiell/isaac-racing-client) or [the server repository](https://github.com/Zamiell/isaac-racing-server).

<br />

## Installation for Development (Windows)

- Open a [Command Prompt as an administrator](https://www.howtogeek.com/194041/how-to-open-the-command-prompt-as-administrator-in-windows-8.1/).
- Install the [Chocolatey](https://chocolatey.org/) package manager:
  - `@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"`
- Install [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/), and [Visual Studio Code](https://code.visualstudio.com/):
  - `choco install git golang nodejs vscode -y`
- Configure Git:
  - `refreshenv`
  - `git config --global user.name "Your_Username"`
  - `git config --global user.email "your@email.com"`
  - `git config --global core.autocrlf false` <br />
  (so that Git does not convert LF to CRLF when cloning repositories)
  - `git config --global pull.rebase true` <br />
  (so that Git automatically rebases when pulling)
- Clone the repository:
  - `cd [the path where you want the code to live]` (optional)
  - If you already have an SSH key pair and have the public key attached to your GitHub profile, then use the following command to clone the repository via SSH:
    - `git clone git@github.com:Zamiell/racing-plus.git`
  - If you do not already have an SSH key pair, then use the following command to clone the repository via HTTPS:
    - `git clone https://github.com/Zamiell/racing-plus.git`
  - Or, if you are doing development work, then clone your forked version of the repository. For example:
    - `git clone https://github.com/[Your_Username]/racing-plus.git`
- Enter the cloned repository:
    - `cd racing-plus`
- Change from the Windows Command Prompt to Git Bash
  - `"%PROGRAMFILES%\Git\bin\sh.exe"`
- Install dependencies:
  - `npm ci`
- Run IsaacScript, which will compile the mod and copy it to your "mods" folder:
  - `./run.sh`

<!--

Other notes:
- Mod directory name: racing+_857628390

-->
