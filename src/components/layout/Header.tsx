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
      <div className='row'>
        <div className='col-12'>
          <h1 className='text-center'>Title</h1>
        </div>
      </div>
      <div className='col-12'>
        <nav className='navbar'>
          <ul className='navbar-nav'>
            <li className='nav-item'>Home</li>
            <li className='nav-item'>게시판</li>
            <li className='nav-item'>
              검색
              <div className='dropdown-menu'>
                <Link to='/find/youtube'>유투브 검색</Link>
                <Link to='/find/news'>뉴스 검색</Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;