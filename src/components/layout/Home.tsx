import {useQuery} from "@tanstack/react-query";
import apiClient from "../../http-commons";
import {MainPageData} from "../../commons/commonsData";

const Home = () => {
  const { isLoading, isError, error, data } = useQuery<{ data: MainPageData }>({
    queryKey: ['main-data'],
    queryFn: async () =>
      await apiClient.get('/')
  });

  if (isLoading) {
    return <h1 className="text-center">Loading...</h1>;
  }
  if (isError) {
    return <h1 className="text-center">Error발생: {error?.message}</h1>;
  }
  const mainPage = data?.data;

  return (
    <div className="container">
      <div className="row">
        <h3 className="text-center">오늘의 책</h3>
        <div className="col-12">
          <img src={mainPage?.main.poster} alt="noimg" />
        </div>
        <h3 className="text-center">많이 찾는 책 Top6</h3>
        {mainPage?.hitList.map((hitBook) => (
          <div className="col-md-6" key={hitBook.isbn}>
            <div className="thumbnail">
              <a href="/w3images/lights.jpg">
                <img src={hitBook.poster} alt="noimg" />
                <div className="caption">
                  <p>{hitBook.title}</p>
                  <p>{hitBook.author}</p>
                </div>
              </a>
            </div>
          </div>)
        )}
        <h3 className="text-center">새로운 책 Top6</h3>
        {mainPage?.newList.map((newBook) => (
          <div className="col-md-6" key={newBook.isbn}>
            <div className="thumbnail">
              <a href="/w3images/lights.jpg">
                <img src={newBook.poster} alt="noimg" />
                <div className="caption">
                  <p>{newBook.title}</p>
                  <p>{newBook.author}</p>
                </div>
              </a>
            </div>
          </div>)
        )}
      </div>
    </div>
  )
}

export default Home;