export type TopicKey = "react" | "angular" | "javascript" | "node" | "system-design"

export const TOPICS: Record<
  TopicKey,
  {
    label: string
    repoUrl: string
    sources: string[] // raw README URL fallbacks
  }
> = {
  react: {
    label: "React",
    repoUrl: "https://github.com/prafulk9155/reactjs-interview-questions",
    sources: [
      "https://raw.githubusercontent.com/prafulk9155/reactjs-interview-questions/master/README.md",
      "https://raw.githubusercontent.com/prafulk9155/reactjs-interview-questions/main/README.md",
    ],
  },
  angular: {
    label: "Angular",
    repoUrl: "https://github.com/sudheerj/angular-interview-questions",
    sources: [
      "https://raw.githubusercontent.com/sudheerj/angular-interview-questions/master/README.md",
      "https://raw.githubusercontent.com/sudheerj/angular-interview-questions/main/README.md",
    ],
  },
  javascript: {
    label: "JavaScript",
    repoUrl: "https://github.com/sudheerj/javascript-interview-questions",
    sources: [
      "https://raw.githubusercontent.com/sudheerj/javascript-interview-questions/master/README.md",
      "https://raw.githubusercontent.com/sudheerj/javascript-interview-questions/main/README.md",
    ],
  },
  node: {
    label: "Node.js",
    repoUrl: "https://github.com/sudheerj/nodejs-interview-questions",
    sources: [
      "https://raw.githubusercontent.com/sudheerj/nodejs-interview-questions/master/README.md",
      "https://raw.githubusercontent.com/sudheerj/nodejs-interview-questions/main/README.md",
    ],
  },
  "system-design": {
    label: "System Design",
    repoUrl: "https://github.com/donnemartin/system-design-primer",
    sources: [
      "https://raw.githubusercontent.com/donnemartin/system-design-primer/master/README.md",
      "https://raw.githubusercontent.com/donnemartin/system-design-primer/main/README.md",
    ],
  },
}

export function isValidTopic(key: string): key is TopicKey {
  return (Object.keys(TOPICS) as TopicKey[]).includes(key as TopicKey)
}
