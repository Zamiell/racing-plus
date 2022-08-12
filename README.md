# The Racing+ Mod

<!-- markdownlint-disable MD033 -->

## Download & Additional Information

Please visit [the website for Racing+](https://isaacracing.net/) or [subscribe to the mod on the Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=857628390).

<br>

## Description

This is the mod for Racing+, a _Binding of Isaac: Repentance_ racing platform. Normally a single player game, the mod, client, and server allow players to be able to race each other in real time.

This mod is written using [IsaacScript](https://isaacscript.github.io/).

See also:

- [Mod changes](docs/changes.md)
- [Race formats](docs/race-formats.md)
- [Custom challenges](docs/challenges.md) (i.e. multi-character speedruns)
- [Version history](https://github.com/Zamiell/isaac-racing-client/blob/master/HISTORY.md)
- [Known bugs](docs/bugs.md)

You may also be interested in [the client repository](https://github.com/Zamiell/isaac-racing-client) or [the server repository](https://github.com/Zamiell/isaac-racing-server).

<br>

## Installation for Development (Windows)

- First, follow the steps on [the IsaacScript getting started documentation](https://isaacscript.github.io/docs/getting-started). Once you have created a test mod and verified in-game that everything works the way it should, read on.
- Download and install [Git](https://git-scm.com/), if you don't have it already.
- Open a new [command prompt window](https://www.howtogeek.com/235101/10-ways-to-open-the-command-prompt-in-windows-10/). (Or, feel free to use Windows Terminal, PowerShell, Git Bash, etc.)
- Configure Git, if you have not done so already:
  - `git config --global user.name "Your_Username"`
  - `git config --global user.email "your@email.com"`
- Clone the repository:
  - `cd [the path where you want the code to live]` (optional)
  - If you already have an SSH key pair and have the public key attached to your GitHub profile, then use the following command to clone the repository via SSH:
    - `git clone git@github.com:Zamiell/racing-plus.git`
  - If you do not already have an SSH key pair, then use the following command to clone the repository via HTTPS:
    - `git clone https://github.com/Zamiell/racing-plus.git`
  - Or, if you are doing development work, then clone your forked version of the repository. For example:
    - `git clone https://github.com/Your_Username/racing-plus.git`
- Enter the cloned repository:
  - `cd racing-plus`
- Install dependencies:
  - `npm ci`
- Run IsaacScript, which will compile the mod and copy it to your "mods" folder:
  - `npx isaacscript`

<!--

Other notes:
- Mod directory name: racing+_857628390

-->
