import { JejuData } from './commonsData';
import { Dispatch, SetStateAction } from 'react';

const PagePrint = ({ pageData, setCurpage }: {
  pageData: JejuData,
  setCurpage: Dispatch<SetStateAction<number>>
}) => {
  const { curpage, totalpage, startPage, endPage } = pageData;
  const pageArr = [];

  // 페이지 이동
  const prev = () => setCurpage(startPage - 1);
  const next = () => setCurpage(endPage + 1);
  const pageChange = (page: number) => setCurpage(page);

  for (let i = startPage; i <= endPage; i++) {
    pageArr.push(
      <li className={i === curpage ? "page-item active" : "page-item"} key={i}>
        <span className="page-link nav-link" onClick={() => pageChange(i)}>{i}</span>
      </li>
    )
  }

  return (
    <nav aria-label="#">
      <ul className="pagination">
        {startPage > 1 ?
          (<li className="page-item" key={startPage - 1}>
          <span className="page-link nav-link" onClick={prev}>&laquo;</span>
          </li>) : null
        }
        {pageArr}
        {endPage < totalpage ?
          (<li className="page-item" key={endPage + 1}>
            <span className="page-link nav-link" onClick={next}>&raquo;</span>
          </li>) : null
        }
      </ul>
    </nav>
  )
};

export default PagePrint;
