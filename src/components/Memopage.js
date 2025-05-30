import { debounce } from "lodash";
import React, { useState, useEffect } from "react";
import "./Memopage.css";

const Memopage = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState();
  const [pageContents, setPageContents] = useState({});
  const [addingPage, setAddingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");

  // 🔧 debounce 저장 함수
  const saveContent = async (userId, title, content) => {
    try {
      await fetch("http://localhost:8080/api/pages/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, content }),
      });
      console.log("자동 저장 완료");
    } catch (err) {
      console.error("자동 저장 실패:", err);
    }
  };

  const debouncedSave = debounce(saveContent, 500); // 0.5초 후 저장

  useEffect(() => {
    const fetchPages = async () => {
      const userId = localStorage.getItem("userId");

      const res = await fetch(`http://localhost:8080/api/pages?userId=${userId}`);
      const data = await res.json();

      const titles = data.map(page => page.title);
      const contents = {};
      data.forEach(p => {
        contents[p.title] = p.content;
      });

      setPages(titles);
      setPageContents(contents);
      setSelectedPage(titles[0] || "");
    };

    fetchPages();
  }, []);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setPageContents({ ...pageContents, [selectedPage]: newContent });

    const userId = localStorage.getItem("userId");
    debouncedSave(userId, selectedPage, newContent);
  };

  const handleAddPage = async () => {
    const title = newPageTitle.trim();
    if (!title || pages.includes(title)) return;

    const userId = localStorage.getItem("userId");

    try {
      await fetch("http://localhost:8080/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title })
      });

      const updated = [...pages, title];
      setPages(updated);
      setSelectedPage(title);
      setNewPageTitle("");
      setAddingPage(false);
    } catch (err) {
      console.error("페이지 저장 실패:", err);
    }
  };

  return (
    <div className="memo-container">
      {/* Sidebar */}
      <div className="memo-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">개인 페이지</h2>
          <button className="add-button" onClick={() => setAddingPage(!addingPage)}>＋</button>
        </div>

        {addingPage && (
          <div className="new-page-input">
            <input
              type="text"
              placeholder="페이지 제목 입력"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPage()}
            />
            <button onClick={handleAddPage}>추가</button>
          </div>
        )}

        <ul className="page-list">
          {pages.map((page) => (
            <li
              key={page}
              className={`page-item ${selectedPage === page ? "active" : ""}`}
              onClick={() => setSelectedPage(page)}
            >
              {page}
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <div className="memo-editor">
        <h2 className="editor-title">{selectedPage}</h2>
        <textarea
          className="editor-textarea"
          placeholder="..."
          value={pageContents[selectedPage] || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Memopage;
