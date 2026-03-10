import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const errorMessage =
    searchParams.get('error') || '로그인 중 오류가 발생했습니다.';

  return (
    <div className="container text-center mt-5">
      <h4 className="text-danger">로그인 실패</h4>
      <p>{decodeURIComponent(errorMessage)}</p>
      <button className="btn btn-primary" onClick={() => navigate('/login')}>
        다시 시도
      </button>
    </div>
  );
};

export default OAuthError;
