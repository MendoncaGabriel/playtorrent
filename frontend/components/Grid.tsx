import Image from 'next/image';

const Grid = async ({data}) => {

  return (
    <div className='grid grid-cols-5 items-center justify-items-center gap-4'>
      {data.map((item: { img: string }, index: number) => (

        <div key={index} style={{ position: 'relative', width: '250px', height: '350px' }}>
          <Image
            src={`/images/${item.img}`}
            alt={`Image ${index}`}
            layout="fill"
            objectFit="cover"
          />
        </div>

      ))}
    </div>
  );
};

export default Grid;
