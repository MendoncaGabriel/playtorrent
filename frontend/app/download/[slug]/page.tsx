interface PageParams {
  params: {
    slug: string;
  };
}

// Componente Server que exibe o slug
const Download = async ({ params }: PageParams) => {
  const { slug } = params;

  // Exibir o slug diretamente
  return (
    <div>
      <h1>Download Page</h1>
      <p>Slug: {slug}</p>
    </div>
  );
};

export default Download;
