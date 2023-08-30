import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Select } from './components/Select/Select';

import styles from './App.module.scss';

type Option = {
  label: string;
  value: string | number;
}

const options = [
  { label: "Physiological needs", value: 1 },
  { label: "Safety needs", value: 2 },
  { label: "Love and social needs", value: 3 },
  { label: "Esteem needs", value: 4 },
  { label: "Cognitive needs", value: 5 },
  { label: "Aesthetic needs", value: 6 },
  { label: "Self-actualization", value: 7 },
  { label: "Transcendence needs", value: 8 },
];

interface FormProps {
  nickname: string;
  option: Option | undefined;
}

function App() {

  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
  } = useForm<FormProps>({
    defaultValues: {
      nickname: '',
      option: options[0],
    },
    mode: 'onChange',
  });

  const { option } = watch();
  
  useEffect(() => {
    register('option');
  }, [register]);

  const onSubmit: SubmitHandler<FormProps> = async data => {
    console.log(data);
  }

  const handleOptionChange = (value: Option | undefined) => {
    setValue('option', value);
  };

  return (
    <div className={styles.app}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input 
          type='text' 
          className={styles.input} 
          placeholder='enter nickname'
          {...register('nickname', {required: true, minLength: 3})} 
        />
        <Select 
          options={options} 
          value={option}
          onChange={(option) => handleOptionChange(option)}
        />
        <button className={styles.button} type='submit'>Submit</button>
      </form>
      
    </div>
  );
}

export default App;
