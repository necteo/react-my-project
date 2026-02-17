import { Fragment, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import boardClient from "../../board-commons";
import {AxiosResponse} from "axios";

interface BoardDeleteProps {
  msg: string;
}

const BoardDelete = () => {
  const nav = useNavigate();
  const { no } = useParams<{ no: string }>();
  const [pwd, setPwd] = useState("");
  const pwdRef = useRef<HTMLInputElement>(null);

  const { mutate: boardDelete } = useMutation({
    mutationFn: async () => {
      return await boardClient.delete(`/board/delete-node/${no}`, {
        data: {
          pwd: pwd
        }
      })
    },
    onSuccess: async (res: AxiosResponse<BoardDeleteProps>) => {
      if (res.data.msg === 'yes') {
        window.location.href = '/board/list';
      } else {
        alert('비밀번호가 틀립니다');
        setPwd('');
        pwdRef.current?.focus();
      }
    },
    onError: async (err) => {
      console.error(err);
    }
  });

  const boardDeleteOk = () => {
    if (!pwd.trim()) {
      pwdRef.current?.focus();
      return;
    }
    boardDelete();
  }

  return (
    <Fragment>
      <div className="breadcumb-area" style={{ backgroundImage: "url(/img/bg-img/breadcumb.jpg)" }}>
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="bradcumb-title text-center">
                <h2>React-Query+TypeScript 삭제하기</h2>
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
                  <li className="breadcrumb-item active" aria-current="page">삭제하기</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <section className="archive-area section_padding_80">
        <div className="container">
          <div className="row" style={{ width: "400px", margin: "0 auto" }}>
            <table className="table">
              <tbody>
              <tr>
                <td className="text-center">
                  비밀번호:<input type="password" size={15} value={pwd} ref={pwdRef} onChange={(e) => setPwd(e.target.value)} />
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <button className="btn-sm btn-primary" onClick={boardDeleteOk}>삭제</button>
                  &nbsp;
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

export default BoardDelete;