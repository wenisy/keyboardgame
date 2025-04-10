# 警察抓小偷打字游戏 (Police Chase Typing Game)

一个基于React和Three.js的3D打字游戏，玩家通过正确输入单词中的字母来控制警察追捕小偷。

## 游戏介绍

在这个游戏中，屏幕上会不断出现单词。每当玩家正确输入一个字母，警察角色就会向前移动一步。如果输入错误，则没有反应。玩家需要在规定时间内通过快速准确地输入单词来让警察追上并抓住小偷。

## 游戏特点

- **3D场景**：使用Three.js创建的3D城市环境
- **角色动画**：警察和小偷角色带有简单的动画效果
- **打字机制**：
  - 正确输入字母使警察前进
  - 完成单词获得额外分数
  - 随着级别提高，单词难度增加
- **游戏进度**：
  - 分数系统
  - 级别系统
  - 倒计时
- **多样化单词库**：根据难度级别提供不同的单词

## 技术栈

- **React** - 用户界面框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 前端构建工具
- **Three.js** - 3D图形库
- **@react-three/fiber** - React的Three.js渲染器
- **@react-three/drei** - Three.js的实用组件集合

## 安装与运行

### 前提条件

- Node.js (推荐v18或更高版本)
- npm或yarn

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/keyboardgame.git
cd keyboardgame
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

4. 在浏览器中打开 http://localhost:5173

## 游戏玩法

1. 点击"开始游戏"按钮
2. 观察屏幕上出现的单词
3. 正确输入单词中的字母，警察会向前移动
4. 在时间结束前追上并抓住小偷即为胜利

## 项目结构

```
src/
├── components/
│   ├── Character.tsx     # 角色模型和动画
│   ├── GameCanvas.tsx    # 游戏主画布和逻辑
│   ├── GameUI.tsx        # 游戏界面组件
│   ├── StartScreen.tsx   # 开始界面
│   └── WordStream.tsx    # 单词生成和输入处理
├── App.tsx               # 主应用程序组件
└── main.tsx              # 应用程序入口点
```

## 未来计划

- 添加音效和背景音乐
- 增加更多角色和场景
- 实现多人对战模式
- 添加成就系统
- 支持移动设备

## 贡献

欢迎提交问题和拉取请求！

## 许可证

[MIT](LICENSE)
