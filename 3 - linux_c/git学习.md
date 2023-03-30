#### 
Git 提供了一个叫做 git config 的工具，专门用来配置或读取相应的工作环境变量。

	注：Ubuntu 20、Windows 10 等系统新版本，已经默认安装了 Git，无需用户再安装。

这些环境变量，决定了 Git 在各个环节的具体工作方式和行为。这些变量可以存放在以下三个不同的地方：  
  
        (1) /etc/gitconfig 文件：系统中对所有用户都普遍适用的配置。若使用 git config 时用 --system 选项，读写的就是这个文件。  
        (2) ~/.gitconfig 文件：用户目录下的配置文件只适用于该用户。若使用 git config 时用 --global 选项，读写的就是这个文件。  
        (3) 当前项目的 Git 目录中的配置文件（也就是工作目录中的 .git/config 文件）：这里的配置仅仅针对当前项目有效。每一个级别的配置都会覆盖上层的相同配置，所以 .git/config 里的配置会覆盖 /etc/gitconfig 中的同名变量。
    此外，Git 还会尝试找寻 /etc/gitconfig 文件，只不过看当初 Git 装在什么目录，就以此作为根目录来定位。


```
git init
在当前目录初始化一个仓库
git config 

git add [pathname]
添加一个文件到git的暂存区

git commit -m “”
提交暂存区的文件到存储区并附说明

git restore [pathname]从存储区中恢复上传的文件


```