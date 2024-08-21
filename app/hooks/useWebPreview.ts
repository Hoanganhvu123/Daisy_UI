import { useState } from 'react';
import { WebElement } from '../types';

export const useWebPreview = () => {
  const [webElements, setWebElements] = useState<WebElement[]>([
    {
      type: 'div',
      props: { className: 'search-icon' },
      children: [{ type: 'i', props: { className: 'fa fa-search' } }]
    }
  ]);

  const updateElement = (updatedElement: WebElement) => {
    setWebElements(prev => [updatedElement]);
  };

  return { webElements, updateElement };
};