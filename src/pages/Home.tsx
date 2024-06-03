function Home({ name }: HomeProps) {
  return <section>{name} is mounted!</section>;
}

export interface HomeProps {
  name: string;
}

export default Home;
