import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  // 指向您正在运行的后端 API
  schema: "http://localhost:3000/shop-api",
  // 扫描 src 目录下所有的 .graphql 文件
  documents: "src/**/*.graphql",
  generates: {
    "src/generated/graphql.ts": {
      // 生成 TypeScript 类型和 React Hooks
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      }
    }
  }
};

export default config;