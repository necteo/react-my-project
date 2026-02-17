import { Fragment, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import boardClient from "../../board-commons";
/*
    1. 발전 속도가 빠르다
    = 이전 버전과 호환성이 떨어진다 => 18
    = 19버전은 TypeScript 권장
              ----------
    useQuery = SELECT
    useMutation = INSERT UPDATE DELETE
 */
const BoardInsert = () => {
  const nav = useNavigate();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [pwd, setPwd] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);

  const { mutate: boardInsert } = useMutation({
    mutationFn: async () => {
      return await boardClient.post('/board/insert-node', {
        name: name,
        subject: subject,
        content: content,
        pwd: pwd
      })
    },
    onSuccess: async (res) => {
      if (res.data.msg === 'yes') {
        window.location.href = '/board/list';
      } else {
        alert('게시판 등록에 실패하셨습니다!!!');
      }
    },
    onError: async (err) => {
      console.error(err.message);
    }
  })

  // 이벤트 처리
  const insert = () => {
    if (!name.trim()) {
      return nameRef.current?.focus();
    }
    if (!subject.trim()) {
      return subjectRef.current?.focus();
    }
    if (!content.trim()) {
      return contentRef.current?.focus();
    }
    if (!pwd.trim()) {
      return pwdRef.current?.focus();
    }
    boardInsert();
  }

  return (
    <Fragment>
      <div className="breadcumb-area" style={{ backgroundImage: "url(/img/bg-img/breadcumb.jpg)" }}>
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="bradcumb-title text-center">
                <h2>React-Query+TypeScript 글쓰기</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="breadcumb-nav">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">커뮤니티</li>
                  <li className="breadcrumb-item">게시판</li>
                  <li className="breadcrumb-item active" aria-current="page">글쓰기</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <section className="archive-area section_padding_80">
        <div className="container">
          <div className="row" style={{ width: "600px", margin: "0 auto" }}>
            <table className="table">
              <tbody>
              <tr>
                <td width="15%">이름</td>
                <td width="85%">
                  <input type="text" size={15} className="input-sm" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} />
                </td>
              </tr>
              <tr>
                <td width="15%">제목</td>
                <td width="85%">
                  <input type="text" size={55} className="input-sm" ref={subjectRef} value={subject} onChange={(e) => setSubject(e.target.value)} />
                </td>
              </tr>
              <tr>
                <td width="15%">내용</td>
                <td width="85%">
                  <textarea rows={10} cols={55} ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </td>
              </tr>
              <tr>
                <td width="15%">비밀번호</td>
                <td width="85%">
                  <input type="password" size={15} className="input-sm" ref={pwdRef} value={pwd} onChange={(e) => setPwd(e.target.value)} />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="text-center">
                  <button className="btn-sm btn-primary" onClick={insert}>글쓰기</button>
                  <button className="btn-sm btn-primary" onClick={() => nav(-1)}>취소</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default BoardInsert;