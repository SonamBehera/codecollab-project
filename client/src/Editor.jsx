import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default function Editor({ code, onChange }) {
  return (
    <div className="h-[80vh] border rounded-xl shadow-lg overflow-hidden">
      <CodeMirror
        value={code}
        height="80vh"
        theme="dark"
        extensions={[javascript()]}
        onChange={onChange}
      />
    </div>
  );
}
