# My Store ミニアプリ

超ミニオンラインストアを実装してみよう。

`git checkout checkpoint-0` から初めましょう！

# Git のワークフロー

1. [ ] Begin by **forking** this repository.

![forking](https://i.imgur.com/PmLC0ON.png)

2. [ ] Then, clone down your fork: `git clone YOUR_FORK_URL`

3. [ ] Then, checkout the appropriate checkpoint branch. Example, for checkpoint 0:

`git checkout checkpoint-0` (checkpoint-0 is the branch name)

4. [ ] Read `checkpoints/checkpoint-0.md` (for checkpoint 0)

5. [ ] Do some work, then make a commit using `git commit`.

6. [ ] Once you finish the work for a checkpoint, checkout the next branch. Example: `git checkout checkpoint-1`

7. [ ] Continue working until you finish!

## セットアップ

``` bash
# install client dependencies
npm install
# install server dependencies
npm install --prefix server
```

## mysql セットアップ

``` bash
# install mysql
brew install mysql
# start mysql
mysql.server start
# stop mysql
mysql.server stop
```

## アプリを実行する

```bash
# serve with hot reload at localhost:8080 (Also concurrently starts the API server on 3000)
npm start

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

セットアップに関して詳しくは [VueJS Templates Guide](http://vuejs-templates.github.io/webpack/) と [Vue-Loader Docs](http://vuejs.github.io/vue-loader) をご覧ください。
