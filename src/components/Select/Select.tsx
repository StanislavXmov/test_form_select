import { MouseEvent, useEffect, useRef, useState } from 'react';

import styles from './Select.module.scss';

export type SelectOptions = {
  label: string;
  value: string | number;
}

type MultipleSelectProps = {
  multiple: true;
  value: SelectOptions[];
  onChange: (value: SelectOptions[]) => void;
}

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOptions;
  onChange: (value: SelectOptions | undefined) => void;
}

type SelectProps = {
  options: SelectOptions[];
} & (SingleSelectProps | MultipleSelectProps)

export const Select = ({ multiple, onChange, options, value }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const clearOptions = (e: MouseEvent) => {
    e.stopPropagation();
    multiple ? onChange([]) : onChange(undefined);
  }

  const selectOption = (option: SelectOptions, e?: MouseEvent) => {
    e?.stopPropagation();
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter(o => o !== option));
      } else {
        onChange([...value, option]);
        setIsOpen(false);
      }
    } else {
      if (option !== value) {
        onChange(option);
        setIsOpen(false);
      }
    }
  }

  const isOptionSelected = (option: SelectOptions) => {
    return multiple ? value.includes(option) : option === value;
  }

  useEffect(() => {
    setHighlightedIndex(undefined);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) {
        return;
      }
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen(prev => !prev);
          if (isOpen && typeof highlightedIndex === 'number') selectOption(options[highlightedIndex]);
          break
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break
          }
          let index = 0;
          if (typeof highlightedIndex !== 'undefined') {
            index = highlightedIndex;
          } else {
            index = -1;
          }
          const newValue = index + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break
        }
        case "Escape":
          setIsOpen(false)
          break
      }
    }
    containerRef.current?.addEventListener('keydown', handler);

    return () => {
      containerRef.current?.removeEventListener('keydown', handler);
    }
  }, [isOpen, highlightedIndex, options]);

  return (
    <div 
      ref={containerRef}
      onBlur={() => {setIsOpen(false); setHighlightedIndex(undefined);}}
      onClick={() => setIsOpen(prev => !prev)}
      tabIndex={0} 
      className={styles.container}
    >
      <span className={styles.value}>{
        multiple 
          ? value.map(v => (
              <button key={v.value} className={styles.optionBadge} onClick={(e) => selectOption(v, e)}>
                {v.label}
                <span className={styles.clearButton}>&times;</span>
              </button>
            )) 
          : value?.label
      }</span>
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
            onClick={(e) => {selectOption(option, e)}}
          >{option.label}</li>
        ))}
      </ul>
    </div>
  );
}
