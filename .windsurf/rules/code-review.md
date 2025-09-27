---
trigger: manual
---

---
trigger: always_on
---

{
"version": "1.0.0",
"lastUpdated": "2025-08-12",
"rules": {
"codeQuality": {
"dry": {
"enabled": true,
"description": "Don't Repeat Yourself - Avoid code duplication",
"severity": "warning"
},
"kiss": {
"enabled": true,
"description": "Keep It Simple, Stupid - Favor simplicity over complexity",
"severity": "warning"
},
"functionLength": {
"maxLines": 30,
"description": "Functions should not exceed max lines",
"severity": "warning"
},
"functionPerformance": {
"complexity": "1 or 2",
"description": "Functions should not exceed complexity of O(n^2) or O(log n)",
"severity": "warning"
},
"fileSize": {
"maxLines": 250,
"description": "Files should not exceed max lines",
"severity": "warning"
},
"use-useApi hook": {
"description": "We have a hook to make api call, make sure always use this to make api calls other than SSE calls.",
"severity": "warning"
},
"Style file seperation": {
"description": "please make sure style should be in seperate file instead of .tsx. if file not exist please create seperate file and move style into that file.",
"severity": "warning"
},
"unneccessary await removed": {
"description": "please make sure to remove 'await' has no effect on the type of the expression.",
"severity": "warning"
},
"statefullLogic": {
"description": "Creating state should always be done in the required file. It should not be created at the container unless it is not required.",
"severity": "warning"
}
},
"naming": {
"variables": {
"pattern": "^[a-z][a-zA-Z0-9]_$",
"description": "Use camelCase for variables and functions"
},
"classes": {
"pattern": "^[A-Z][a-zA-Z0-9]_$",
        "description": "Use PascalCase for class names"
      },
      "constants": {
        "pattern": "^[A-Z][A-Z0-9_]*$",
"description": "Use UPPER_SNAKE_CASE for constants"
}
},
"errorHandling": {
"requireTryCatch": {
"enabled": true,
"description": "Async operations should have proper error handling"
},
"noConsoleLogs": {
"enabled": true,
"description": "Avoid console.log in production code"
}
},
"dependencies": {
"circularDependencies": {
"enabled": true,
"severity": "error"
},
"unusedImports": {
"enabled": true,
"severity": "warning"
}
},
"security": {
"noHardcodedSecrets": {
"enabled": true,
"severity": "error"
},
"sqlInjection": {
"enabled": true,
"severity": "error"
},
"xssProtection": {
"enabled": true,
"severity": "error"
}
}
},
"exclude": [
"**/node_modules/**",
"**/*.spec.ts",
"**/*.test.ts",
"**/dist/**",
"**/build/**"
]
}