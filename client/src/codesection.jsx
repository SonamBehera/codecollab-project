import { useState, useEffect, useRef } from "react";
import Editor from "./Editor";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";

export default function CodeSection({ code, onCodeChange }) {
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const outputRef = useRef(null);

  // Map languages to CodeMirror extensions
  const languageMap = {
    javascript: javascript(),
    python: python(),
    cpp: cpp(),
  };

  const [editorExtension, setEditorExtension] = useState(languageMap[language]);
  useEffect(() => {
    setEditorExtension(languageMap[language]);
  }, [language]);

  // Run code (JS only in browser)
  const runCode = () => {
    if (language === "javascript") {
      try {
        let result = "";
        setIsError(false);

        // Capture console.log outputs
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          result += args.join(" ") + "\n";
        };

        const evalResult = eval(code);
        if (evalResult !== undefined) result += evalResult + "\n";

        console.log = originalConsoleLog;
        setOutput(result || "Code executed successfully!");
      } catch (err) {
        setOutput(err.message);
        setIsError(true);
      } finally {
        // Auto-scroll output
        setTimeout(() => {
          if (outputRef.current)
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }, 0);
      }
    } else {
      setOutput("Running code is supported only for JavaScript in browser.");
      setIsError(true);
    }
  };

  // Download code
  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    const ext = language === "javascript" ? "js" : language === "python" ? "py" : "cpp";
    link.href = URL.createObjectURL(blob);
    link.download = `code.${ext}`;
    link.click();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Language selector + buttons */}
      <div className="flex items-center gap-2 mb-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
        <button onClick={runCode} className="bg-blue-500 text-white px-3 py-1 rounded">
          Run
        </button>
        <button onClick={downloadCode} className="bg-green-500 text-white px-3 py-1 rounded">
          Download
        </button>
      </div>

      {/* Editor */}
      <Editor
        code={code}
        onChange={onCodeChange} // real-time collaborative updates
        extensions={[editorExtension]}
      />

      {/* Output panel */}
      <div
        ref={outputRef}
        className="bg-gray-200 p-2 mt-2 rounded overflow-auto max-h-96"
      >
        <strong>Output:</strong>
        <pre className={isError ? "text-red-600" : "text-black"}>{output}</pre>
      </div>
    </div>
  );
}
