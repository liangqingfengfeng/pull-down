import React from 'react';
import style from './index.module.less';

/**
 * loading猫头
 * @returns ReactNode
 */
function LoadingCat({ dynamic }) {
  return (
    <div className={style.loader}>
      <span className={dynamic ? style.loaderImgDynamic : style.loaderImg}></span>
      <span className={style.innnerLoading}></span>
    </div>
  );
};

export default LoadingCat;
