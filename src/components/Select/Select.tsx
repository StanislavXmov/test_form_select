import { MouseEvent, useEffect, useState } from 'react';

import styles from './Select.module.scss';

export type SelectOptions = {
  label: string;
  value: string | number;
}

interface SelectProps {
  value?: SelectOptions;
  onChange: (value: SelectOptions | undefined) => void;
  options: SelectOptions[]
}

export const Select = ({onChange, options, value}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>();

  const clearOptions = (e: MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  }

  const selectOption = (e: MouseEvent, option: SelectOptions) => {
    e.stopPropagation();
    if (option !== value) {
      onChange(option);
      setIsOpen(false);
    }
  }

  const isOptionSelected = (option: SelectOptions) => {
    return option === value;
  }

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(undefined);
    }
  }, [isOpen]);

  return (
    <div 
      onBlur={() => {setIsOpen(false); setHighlightedIndex(undefined);}}
      onClick={() => setIsOpen(prev => !prev)}
      tabIndex={0} 
      className={styles.container}
    >
      <span className={styles.value}>{value?.label}</span>
      <button 
        type='button'
        className={styles.clearButton}
        onClick={(e) => {clearOptions(e)}}
      >&times;</button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
        {options.map((option, i) => (
          <li 
            key={option.value} 
            className={
              `${styles.option} 
              ${isOptionSelected(option) ? styles.selected : ''}
              ${highlightedIndex === i ? styles.highlighted : ''}
              `
            }
            onMouseEnter={() => setHighlightedIndex(i)}
            onClick={(e) => {selectOption(e, option)}}
          >{option.label}</li>
        ))}
      </ul>
    </div>
  )
}
