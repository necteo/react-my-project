import { useMutation, useQuery } from "@tanstack/react-query";
import { Fragment, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../http-commons";
import { BookDetailProps } from "../../commons/commonsData";
import { AxiosResponse } from "axios";

const BookDetail = () => {
  const { contentid } = useParams();
  const nav = useNavigate();

  const [isInserting, setIsInserting] = useState(true);
  const [no, setNo] = useState(0);
  // 추가
  const [msg, setMsg] = useState('');
  const msgRef = useRef<HTMLTextAreaElement>(null);

  // 수정
  const [umsg, setUmsg] = useState('');
  const umsgRef = useRef<HTMLTextAreaElement>(null);

  const { isLoading, isError, error, data, refetch: jejuDetail } = useQuery<{ data: BookDetailProps }>({
    queryKey: ['detail-jeju', contentid],
    queryFn: async () => {
      return await apiClient.get(`/jeju/detail-react/${contentid}`)
    }
  });

  // insert
  const { mutate: commentInsert } = useMutation<BookDetailProps>({
    mutationFn: async () => {
      const res: AxiosResponse<BookDetailProps, Error> = await apiClient.post(`/comment/insert`, {
        cno: contentid,
        id: sessionStorage.getItem('id'),
        name: sessionStorage.getItem('name'),
        msg: msg
      });
      return res.data;
    },
    onSuccess: (data: BookDetailProps) => {
      jejuDetail();
      if (msgRef.current) {
        setMsg('');
        msgRef.current.focus();
      }
    },
    onError: (err: Error) => {
      console.error('Error발생:', err.message);
    }
  });

  const { mutate: commentDelete } = useMutation<BookDetailProps>({
    mutationFn: async () => {
      const res: AxiosResponse<BookDetailProps, Error> = await apiClient.delete(`/comment/delete/${no}/${contentid}`);
      return res.data;
    },
    onSuccess: (data: BookDetailProps) => {
      jejuDetail();
    },
    onError: (err: Error) => {
      console.error('Error발생 :', err.message);
    }
  });

  const { mutate: commentUpdate } = useMutation<BookDetailProps>({
    mutationFn: async () => {
      const res: AxiosResponse<BookDetailProps, Error> = await apiClient.put('/comment/update', {
        no: no,
        msg: umsg
      });
      return res.data;
    },
    onSuccess: (data: BookDetailProps) => {
      jejuDetail();
      if (umsgRef.current) {
        setUmsg('');
      }
      setIsInserting(true);
    },
    onError: (err: Error) => {
      console.error('Error발생 :', err.message);
    }
  });

  if (isLoading) {
    return <h1 className="text-center">Loading...</h1>;
  }
  if (isError) {
    return <h1 className="text-center">Error 발생: {error?.message}</h1>;
  }

  const jejuData =  data?.data.dto;
  const comment = data?.data.comments;
  console.log(comment);
  // 이벤트 처리
  const insert = () => {
    if (msg === '') {
      msgRef.current?.focus();
      return;
    }
    commentInsert();
  }

  const del = (no: number) => {
    setNo(no);
    commentDelete();
  }

  const updateData = (no: number, index: number) => {
    console.log(umsgRef.current);
    if (umsgRef.current && comment) {
      setUmsg(comment[index].msg);
      umsgRef.current.focus();
    }
    setIsInserting(false);
    setNo(no);
  }

  const update = () => {
    if (umsg === '') {
      umsgRef.current?.focus();
      return;
    }
    commentUpdate();
  }

  return (
    <Fragment>
      <div className="breadcumb-area" style={{ backgroundImage: "url(/img/bg-img/breadcumb.jpg)" }}>
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="bradcumb-title text-center">
                <h2>명소 상세 보기</h2>
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
                  <li className="breadcrumb-item">제주여행</li>
                  <li className="breadcrumb-item">제주 명소</li>
                  <li className="breadcrumb-item active" aria-current="page">명소 상세 보기</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <section className="archive-area section_padding_80">
        <div className="container">
          <div className="row">
            <table className="table">
              <tbody>
              <tr>
                <td className="text-center" rowSpan={6} width="30%">
                  <img src={jejuData?.image1} alt="" style={{ width: "350px", height: "300px" }} />
                </td>
                <td colSpan={2}><h3>{jejuData?.title}</h3></td>
              </tr>
              <tr>
                <td className="text-center" width="15%">주소</td>
                <td width="55%">{jejuData?.address}</td>
              </tr>
              <tr>
                <td className="text-center" width="15%">휴일</td>
                <td width="55%" dangerouslySetInnerHTML={{ __html: jejuData?.restdate ?? '' }}></td>
              </tr>
              <tr>
                <td className="text-center" width="15%">사용시간</td>
                <td width="55%" dangerouslySetInnerHTML={{ __html: jejuData?.usetime ?? '' }}></td>
              </tr>
              <tr>
                <td className="text-center" width="15%">주차</td>
                <td width="55%">{jejuData?.parking}</td>
              </tr>
              <tr>
                <td className="text-center" width="15%">안내</td>
                {/*HTML로 파싱 dangerouslySetInnerHTML*/}
                <td width="55%" dangerouslySetInnerHTML={{ __html: jejuData?.infocenter ?? '' }}></td>
              </tr>
              </tbody>
            </table>
            <table className="table">
              <tbody>
              <tr>
                <td>{jejuData?.msg}</td>
              </tr>
              </tbody>
            </table>
            {/* 지도 
            <table className="table">
              <tbody>
              <tr>
                <td className="text-center">
                  <MapPrint address={jejuData?.address ?? ''} name={jejuData?.title ?? ''} />
                </td>
              </tr>
              </tbody>
            </table>*/}
            {/* 댓글 */}
            <table className="table">
              <tbody>
              <tr>
                <td className="text-center"><h3>[댓글]</h3></td>
              </tr>
              <tr>
                <td>
                  {comment && comment.map((com, index) => (
                    <table className="table" key={index}>
                      <tbody>
                      <tr>
                        <td className="text-left" width="80%">◐{com.name}({com.dbday})</td>
                        <td className="text-right" width="20%">
                          {com.id === sessionStorage.getItem("id") &&
                            (<span>
                              <button className="btn-sm btn-warning" onClick={() => updateData(com.no, index)}>수정</button>&nbsp;
                              <button className="btn-sm btn-warning" onClick={() => (del(com.no))}>삭제</button>
                            </span>)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} valign="top">
                          <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "white", border: "none" }}>{com.msg}</pre>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  ))}
                </td>
              </tr>
              </tbody>
            </table>
            {sessionStorage.getItem("id") && (isInserting ?
              (<table className="table">
                <tbody>
                <tr>
                  <td>
                    <textarea rows={4} cols={120} style={{ float: "left" }} ref={msgRef} value={msg} onChange={(e) => setMsg(e.target.value)}></textarea>
                    <button className="btn-sm btn-primary" style={{ float: "left", width: "100px", height: "100px" }} onClick={insert}>댓글쓰기</button>
                  </td>
                </tr>
                </tbody>
              </table>) : (
                <table className="table">
                  <tbody>
                  <tr>
                    <td>
                      <textarea rows={4} cols={120} style={{ float: "left" }} ref={umsgRef} value={umsg} onChange={(e) => setUmsg(e.target.value)}></textarea>
                      <button className="btn-sm btn-primary" style={{ float: "left", width: "100px", height: "100px" }} onClick={update}>댓글수정</button>
                    </td>
                  </tr>
                  </tbody>
                </table>)
              )}
          </div>
        </div>
      </section>
    </Fragment>
  )
};

export default BookDetail;