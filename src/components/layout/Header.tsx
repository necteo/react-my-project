import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../../http-commons';
import { AxiosResponse } from "axios";

const Header = () => {
  const [login, setLogin] = useState(false);
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');

  const idRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);

  interface LoginResponse {
    msg: 'NOID' | 'NOPWD' | 'OK';
    id?: string;
    name?: string;
  }

  const { mutate: loginOk } = useMutation({
    mutationFn: async () => {
      return await apiClient.post('/member/login', {
        id: id,
        pwd: pwd,
      });
    },
    onSuccess: ({ data }: AxiosResponse<LoginResponse>) => {
      if (data.msg === 'NOID') {
        alert('아이디가 존재하지 않습니다');
        setId('');
        setPwd('');
        idRef.current?.focus();
      } else if (data.msg === 'NOPWD') {
        alert('비밀번호가 틀립니다');
        setPwd('');
        pwdRef.current?.focus();
      } else if (data.msg === 'OK' && data.id && data.name) {
        console.log('로그인 성공');
        sessionStorage.setItem('id', data.id);
        sessionStorage.setItem('name', data.name);
        setLogin(true);
        window.location.reload();
      }
    },
    onError: (error) => {
      console.error('Login Error', error.message);
    },
  });

  useEffect(() => {
    if (sessionStorage.getItem('id')) {
      setLogin(true);
    }
  }, []);

  const memberLogin = () => {
    if (!id.trim()) {
      idRef.current?.focus();
      return;
    }
    if (!pwd.trim()) {
      pwdRef.current?.focus();
      return;
    }
    loginOk();
  };

  const memberLogout = () => {
    sessionStorage.clear();
    setId('');
    setPwd('');
    setLogin(false);
    window.location.reload();
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-12 text-right'>
          {!login ? (
            <div className='login'>
              ID:
              <input
                type='text'
                size={10}
                className='input-sm'
                ref={idRef}
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              &nbsp;
              PW:
              <input
                type='password'
                size={10}
                className='input-sm'
                ref={pwdRef}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && memberLogin()}
              />
              &nbsp;
              <button className='btn-sm btn-primary' onClick={memberLogin}>
                로그인
              </button>
            </div>
          ) : (
            <div className='login'>
              {window.sessionStorage.getItem('name')}님 로그인 중입니다
              <button className='btn-sm btn-danger' onClick={memberLogout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
      <div className='col-12'>
        <nav className='navbar'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <Link to='/'>Home</Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="yummyDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >책</a>
              <div className="dropdown-menu" aria-labelledby="yummyDropdown">
                <Link className="dropdown-item" to="/book/list">전체보기</Link>
              </div>
            </li>
            <li className='nav-item'>
              <Link to='board/list'>게시판</Link>
            </li>
            <li className='nav-item dropdown'>
              <a className="nav-link dropdown-toggle" href="#" role="button">검색</a>
              <div className='dropdown-menu'>
                <Link className="dropdown-item" to='/find/youtube'>유튜브 검색</Link>
                <Link className="dropdown-item" to='/find/news'>뉴스 검색</Link>
              </div>
            </li>
            {login &&
              <li className="nav-item">
                <Link className="nav-link" to="/chat/chatbot">챗봇</Link>
              </li>
            }
            <li className="nav-item">
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/board/list">커뮤니티</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;