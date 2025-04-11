# 打字大师 - 键盘打字练习游戏

一个用于提高打字技能的交互式Web应用程序。通过有趣的练习和教程，帮助用户提高打字速度和准确性。

## 功能特点

- **基础教程**：学习正确的手指位置和基本打字技巧
- **进阶教程**：提高打字速度和准确性，学习高级技巧
- **打字练习**：通过各种难度级别的练习提高打字能力
- **可视化键盘**：实时显示手指位置和按键反馈
- **性能统计**：跟踪WPM（每分钟字数）、准确率和错误数

## 在线体验

访问 [type.nodal.link](https://type.nodal.link) 体验打字大师应用程序。

## 技术栈

- **React** - 用户界面框架
- **TypeScript** - 类型安全的JavaScript
- **React Router** - 页面路由
- **Vite** - 前端构建工具
- **CSS** - 样式和动画

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/keyboardgame.git

# 进入项目目录
cd keyboardgame

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 使用方法

1. 登录或创建账号
2. 选择基础教程、进阶教程或打字练习
3. 按照屏幕提示进行打字练习
4. 查看你的WPM和准确率统计数据

## 项目结构

```
src/
├── components/  # 组件
│   └── Keyboard.tsx  # 键盘组件
├── pages/       # 页面
│   ├── Login.tsx     # 登录页面
│   ├── Home.tsx      # 主页
│   ├── BasicTutorial.tsx  # 基础教程
│   ├── AdvancedTutorial.tsx  # 进阶教程
│   └── Practice.tsx  # 打字练习
├── styles/      # 样式
├── App.tsx       # 主应用程序组件
└── main.tsx      # 应用程序入口点
```

## 部署

该项目使用GitHub Actions自动部署到GitHub Pages。

```bash
# 手动部署
npm run deploy
```

## 未来计划

- 添加用户数据持久化（使用localStorage或后端数据库）
- 增加更多的练习文本和难度级别
- 添加打字比赛或多人对战功能
- 实现打字统计和进度跟踪
- 添加自定义主题和键盘布局

## 许可证

MIT

## 作者

Bin Xiong
