# 星盘塔罗测试

一个适合部署到 GitHub Pages 的静态塔罗测试网站。功能包括问题输入、单张牌/三张牌测试、结构化解读、浏览器本地历史记录、JSON 导出与导入。

## Todo List

- [x] 明确 MVP：塔罗测试、抽牌结果、主题建议、历史记录。
- [x] 选择部署方式：静态 HTML/CSS/JS + GitHub Pages。
- [x] 实现记录存储：使用 `localStorage` 保存最近 50 条记录。
- [x] 增加数据迁移能力：支持 JSON 导出和导入。
- [x] 增加 GitHub Actions：推送到 `main` 后自动部署 Pages。
- [ ] 在 GitHub 仓库 Settings > Pages 中将 Source 设置为 GitHub Actions。
- [ ] 运营上线前补充隐私说明、免责声明、站点图标和自定义域名。

## 本地预览

直接用浏览器打开 `index.html` 即可预览。也可以使用任意静态服务器：

```bash
python -m http.server 8080
```

## GitHub 部署步骤

1. 在 GitHub 新建仓库，例如 `tarot-reading-site`。
2. 本地初始化并推送：

```bash
git init
git add .
git commit -m "Create tarot reading site"
git branch -M main
git remote add origin https://github.com/<你的用户名>/tarot-reading-site.git
git push -u origin main
```

3. 打开仓库 `Settings > Pages`。
4. 在 `Build and deployment` 中将 `Source` 选择为 `GitHub Actions`。
5. 等待 Actions 完成后访问 Pages 地址。

GitHub 官方文档说明 Pages 可从分支发布，也可用 GitHub Actions 发布；本项目使用 Actions，便于以后接入构建流程或更多静态资源。

## 存储说明

当前版本不需要服务器，记录保存在用户自己的浏览器 `localStorage` 中。优点是部署简单、隐私风险低；限制是换设备或清理浏览器后记录不会自动同步。

如果后续需要账号体系、跨设备同步、运营后台和用户画像，可以升级到：

- Supabase：适合快速实现登录、数据库、后台查询。
- Firebase：适合移动端生态和实时同步。
- 自建 API：适合强定制和完整数据所有权。
