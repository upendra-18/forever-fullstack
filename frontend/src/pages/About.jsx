import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/assets'
const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
        </div>
        <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident sapiente eos quia reprehenderit distinctio dolores dolorum minima quis consequatur odit commodi tenetur, quisquam consectetur sunt explicabo aut temporibus! Blanditiis, non Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, debitis consectetur. Placeat, quae adipisci. Debitis, ratione cupiditate. Deserunt officia nesciunt alias magnam praesentium.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum non reprehenderit alias necessitatibus praesentium quis beatae ex cum id aliquam harum nisi suscipit iste, impedit nam consectetur velit dolor. Repellat! Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus inventore fugit quam doloribus asperiores ab odio. Omnis fuga nostrum fugiat, inventore est deleniti quam, cumque quas sunt, sed laborum mollitia?</p>
            <b className='text-gray-800'>Our Mission</b>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, illo porro reprehenderit suscipit fugiat maiores tempora, hic excepturi ad, iure iste inventore. Sapiente quod animi magni beatae amet consectetur est.</p>
          </div>
        </div>
        <div className='text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'}/>
        </div>
        <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt tempora saepe architecto nisi exercitationem, eius corporis accusantium beatae, laborum natus, doloribus quae illo nam commodi! Consequatur nihil animi corrupti pariatur.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convinience:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt tempora saepe architecto nisi exercitationem, eius corporis accusantium beatae, laborum natus, doloribus quae illo nam commodi! Consequatur nihil animi corrupti pariatur.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt tempora saepe architecto nisi exercitationem, eius corporis accusantium beatae, laborum natus, doloribus quae illo nam commodi! Consequatur nihil animi corrupti pariatur.</p>
          </div>
        </div>
        <NewsletterBox/>
    </div>
  )
}

export default About