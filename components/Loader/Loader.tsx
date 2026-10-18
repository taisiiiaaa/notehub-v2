import { ThreeDots } from 'react-loader-spinner'
import styles from './Loader.module.css'

const Loader = () => {
  return (
    <div className={styles.loader}>
      <ThreeDots visible height={30} width={30} color='#0d6efd' radius='16' ariaLabel='loading' />
    </div>
  )
}

export default Loader
