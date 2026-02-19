import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/layout/Home";
import BookList from "./components/book/BookList";
import BookDetail from "./components/book/BookDetail";
import BoardList from "./components/board/BoardList";
import BoardInsert from "./components/board/BoardInsert";
import BoardDetail from "./components/board/BoardDetail";
import BoardUpdate from "./components/board/BoardUpdate";
import BoardDelete from "./components/board/BoardDelete";
import YoutubeFind from "./components/youtube/YoutubeFind";
import ChatBot from "./components/chat/ChatBot";
import NewsFind from "./components/news/NewsFind";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/list" element={<BookList />} />
        <Route path="/book/detail/:isbn" element={<BookDetail />} />
        <Route path="/board/list" element={<BoardList />} />
        <Route path="/board/insert" element={<BoardInsert />} />
        <Route path="/board/detail/:no" element={<BoardDetail />} />
        <Route path="/board/update/:no" element={<BoardUpdate />} />
        <Route path="/board/delete/:no" element={<BoardDelete />} />
        <Route path="/youtube/find" element={<YoutubeFind />} />
        <Route path="/chat/chatbot" element={<ChatBot />} />
        <Route path="/news/find" element={<NewsFind />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
