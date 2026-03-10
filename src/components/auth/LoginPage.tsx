const LoginPage = () => {
  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    // 브라우저가 직접 이동 — axios 사용 안 함
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4 text-center">
          <h3 className="mb-4">소셜 로그인</h3>

          <button
            className="btn btn-danger btn-block mb-2"
            style={{ width: '100%' }}
            onClick={() => handleSocialLogin('google')}
          >
            Google로 로그인
          </button>

          <button
            className="btn btn-warning btn-block mb-2"
            style={{ width: '100%' }}
            onClick={() => handleSocialLogin('kakao')}
          >
            카카오로 로그인
          </button>

          <button
            className="btn btn-success btn-block"
            style={{ width: '100%' }}
            onClick={() => handleSocialLogin('naver')}
          >
            네이버로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
