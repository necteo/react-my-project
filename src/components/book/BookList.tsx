import {Fragment, useState} from "react";
import { useQuery} from "@tanstack/react-query";
import { BookListData } from "../../commons/commonsData";
import apiClient from "../../http-commons";
import PagePrint from "../../commons/PagePrint";
import {Link} from "react-router-dom";

const BookList = () => {
  const [curpage, setCurpage] = useState<number>(1);
  const { isLoading, isError, error, data } = useQuery<{ data: BookListData }>({
    queryKey: ['book-list' + curpage],
    queryFn: async () => {
      return await apiClient.get(`/book/list-react/${curpage}`);
    }
  });

  if (isLoading) {
    return <h1 className="text-center">Loading...</h1>;
  }
  if (isError) {
    return <h1 className="text-center">Error 발생: {error?.message}</h1>;
  }

  return (
    <Fragment>
      <div className="breadcumb-area" style={{ backgroundImage: "url(/img/bg-img/breadcumb.jpg)" }}>
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="bradcumb-title text-center">
                <h2>전체보기</h2>
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
                  <li className="breadcrumb-item">책</li>
                  <li className="breadcrumb-item active" aria-current="page">전체보기</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <section className="archive-area section_padding_80">
        <div className="container">
          <div className="row">
            {data?.data.list && data.data.list.map((book, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <div className="single-post wow fadeInUp" data-wow-delay="0.1s">
                  <div className="post-thumb">
                    <Link to={`/book/detail/${book.isbn}`}>
                      <img src={book.poster} alt="" />
                    </Link>
                  </div>
                  <div className="post-content">
                    <div className="post-meta d-flex">
                      <div className="post-author-date-area d-flex">
                        <div className="post-author">
                          <a href="#" style={{ whiteSpace: "nowrap",overflow: "hidden" , textOverflow: "ellipsis" }}>{book.title}</a>
                        </div>
                        <div className="post-date">
                          <a href="#">{book.author}</a>
                        </div>
                      </div>
                      <div className="post-comment-share-area d-flex">
                        <div className="post-favourite">
                          <a href="#"><i className="fa fa-heart-o" aria-hidden="true"></i> 10</a>
                        </div>
                        <div className="post-comments">
                          <a href="#"><i className="fa fa-comment-o" aria-hidden="true"></i> 12</a>
                        </div>
                        <div className="post-share">
                          <a href="#"><i className="fa fa-share-alt" aria-hidden="true"></i></a>
                        </div>
                      </div>
                    </div>
                    <a href="#">
                      <h4 className="post-headline">{book.price}</h4>
                    </a>
                  </div>
                </div>
              </div>)
            )}
            <div className="col-12">
              <div className="pagination-area d-sm-flex mt-15">
                {data?.data && <PagePrint pageData={data.data} setCurpage={setCurpage} />}
                <div className="page-status">
                  <p>Page {curpage} of {data?.data.totalpage} results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default BookList;