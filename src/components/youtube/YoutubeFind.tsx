import {Fragment, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import { youtubeApi } from "./youtubeApi";

const YoutubeFind = () => {
  const [fd, setFd] = useState('제주여행');
  const [searchTerm, setSearchTerm] = useState(fd);
  const fdRef = useRef<HTMLInputElement>(null);
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['youtube', searchTerm],
    queryFn: async () => await youtubeApi(searchTerm),
    enabled: !!searchTerm,
  });

  const findClick = () => {
    if (!fd.trim()) {
      fdRef.current?.focus();
      return null;
    }
    setSearchTerm(fd.trim());
  }

  console.log(data);

  if (isLoading) {
    return <h1 className="text-center">Loading...</h1>;
  }
  if (isError) {
    return <h1 className="text-center">Error: {error.message}</h1>;
  }

  return (
    <Fragment>
      <div className="breadcumb-area" style={{ backgroundImage: "url(/img/bg-img/breadcumb.jpg)" }}>
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="bradcumb-title text-center">
                <h2>Youtube 동영상 검색</h2>
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
                  <li className="breadcrumb-item">검색</li>
                  <li className="breadcrumb-item active" aria-current="page">동영상검색</li>
                </ol>
              </nav>
            </div>
            <div className="col-12">
              <input type="text" size={20} className="input-sm" ref={fdRef} value={fd} onChange={(e) => setFd(e.target.value)} />
              <button className="btn-sm btn-primary" onClick={findClick}>검색</button>
            </div>
          </div>
        </div>
      </div>

      <section className="archive-area section_padding_80">
        <div className="container">
          <div className="row" style={{ width: "500px", margin: "0 auto" }}>
            {data?.items?.map((item, index) => (
              <div className="col-12" key={index}>
                <div className="single-post">
                  <div className="post-thumb">
                    <iframe src={"https://www.youtube.com/embed/" + item.id.videoId} title={item.snippet.title} allowFullScreen={true} width="450" height="300" />
                  </div>
                  <div className="post-content">
                    <h4 className="post-content">{item.snippet.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default YoutubeFind;