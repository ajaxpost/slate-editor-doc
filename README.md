https://codesandbox.io/p/sandbox/slate-dnd-kit-brld4z?file=%2Fsrc%2FApp.js%3A87%2C33-87%2C38

# git提交规范:

1. feat - 新功能 feature
2. fix - 修复 bug
3. docs - 文档注释
4. style - 代码格式(不影响代码运行的变动)
5. refactor - 重构、优化(既不增加新功能，也不是修复bug)
6. perf - 性能优化
7. test - 增加测试
8. chore - 构建过程或辅助工具的变动
9. revert - 回退
10. build - 打包

- [x] 拖拽

yarn pdc
yarn pdp
yarn dev

待解决的问题:

待实现的功能:

1. 在每个插件中新增 create 函数,用于单独的实现创建节点功能,之前是采用公共 createBlock 函数来创建节点
1. 在其他节点中嵌套节点,比如在 blockquote 中嵌套 headings 节点
