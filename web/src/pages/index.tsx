import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container} from "react-bootstrap";
import Pagination from 'react-bootstrap/Pagination';
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import { useRouter } from "next/router";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  total: number
  page: number
  limit: number
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  const { query } = ctx;
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 20;

  try {
    const API_URL = process.env.API_URL || 'http://localhost:3000'
    const res = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`, {method: 'GET'})

    if (!res.ok) {
      return {props: {statusCode: res.status, users: [], total: 0, page, limit}}
    }

    const { users, total } = await res.json();

    return {
      props: {statusCode: 200, users, total, page, limit}
    }
  } catch (e) {
    return {props: {statusCode: 500, users: [], total: 0, page, limit}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, users, total, page, limit}: TGetServerSideProps) {
  const router = useRouter();

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}&limit=${limit}`);
  }

  const calculateVisiblePageRange = (page: number, totalPages: number) => {
    const pageCountToShow = 10;
    const offsetFromCurrentPage = Math.floor(pageCountToShow / 2);

    let startPage = Math.max(1, page - offsetFromCurrentPage);
    let endPage = Math.min(totalPages, startPage + pageCountToShow - 1);

    if (endPage - startPage < pageCountToShow - 1) {
      startPage = Math.max(1, endPage - pageCountToShow + 1);
    }

    return {startPage, endPage};
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First
              disabled={page === 1}
              onClick={() => handlePageChange(1)}
            />
            <Pagination.Prev
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const { startPage, endPage } = calculateVisiblePageRange(page, totalPages);

              if (p < startPage || p > endPage) return null;

              return (
                <Pagination.Item
                  linkStyle={{minWidth: '3.2rem', textAlign: 'center', letterSpacing: '-0.1rem'}}
                  key={p}
                  active={p === page}
                  onClick={() => handlePageChange(p)}
                >{p}</Pagination.Item>
              )
            })}
            <Pagination.Next
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            />
            <Pagination.Last
              disabled={page === totalPages}
              onClick={() => handlePageChange(totalPages)}
            />
          </Pagination>

        </Container>
      </main>
    </>
  );
}
