
const IMAGES = {
    doc : new URL("../../assets/lander/documents.png" , import.meta.url).href,
    read : new URL("../../assets/lander/reading.png" , import.meta.url).href,
    doc_dark : new URL("../../assets/lander/documents-dark.png" , import.meta.url).href,
    read_dark : new URL("../../assets/lander/reading-dark.png" , import.meta.url).href,

    
  }

function Heroes() {
  return (
    <div className='flex flex-col items-center justify-center max-w-5xl dark:text-white'>
        <div className='flex items-center'>
            <div className='relative w-[300px] h-[300px] sm:w-[350px] sm:h-[400px] md:h-[400px] md:w-[400px]'>
                <img src={IMAGES.doc} className='object-contain dark:hidden' alt="documents" />
                <img src={IMAGES.doc_dark} className='object-contain hidden dark:block' alt="documents" />
            </div>
            <div className='relative h-[400px] w-[400px] hidden md:block'>
                <img src={IMAGES.read} className='object-contain dark:hidden' alt="Reading" />
                <img src={IMAGES.read_dark} className='object-contain hidden dark:block' alt="Reading" />
            </div>
        </div>
      
    </div>
  )
}

export default Heroes
