import React, {
   useEffect,
   useRef,
   useImperativeHandle,
   forwardRef,
   useState,
   useCallback,
} from 'react';
import { Container, TextInput, Icon } from './styles';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

interface InputProps extends TextInputProps {
   name: string;
   icon: string;
   containerStyle?: {};
}

interface InputValueReference {
   value: string;
}

interface InputRef {
   focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
   { name, icon, containerStyle = {}, ...rest },
   ref,
) => {
   const inputElementRef = useRef<any>(null);
   const { registerField, defaultValue = '', fieldName, error } = useField(
      name,
   );
   const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

   const [isFocused, setIsFocused] = useState(false);
   const [isFilled, setIsFilled] = useState(false);

   const handleInpuFocus = useCallback(() => {
      setIsFocused(true);
   }, []);

   const handleInpuBlur = useCallback(() => {
      setIsFocused(false);
      setIsFilled(!!inputValueRef.current.value);
   }, []);

   useImperativeHandle(ref, () => ({
      focus() {
         inputElementRef.current.focus();
      },
   }));

   useEffect(() => {
      registerField({
         name: fieldName,
         ref: inputValueRef.current,
         path: 'value',
         setValue(ref: any, value: string) {
            inputValueRef.current.value = value;
            inputElementRef.current.setNativeProps({ text: value });
         },
         clearValue() {
            inputValueRef.current.value = '';
            inputElementRef.current.clear();
         },
      });
   }, [fieldName, registerField]);

   return (
      <Container
         isFocused={isFocused}
         isErrored={!!error}
         style={containerStyle}
      >
         <Icon
            name={icon}
            size={20}
            color={isFocused || isFilled ? '#ff9000' : '#666360'}
         />
         <TextInput
            ref={inputElementRef}
            {...rest}
            placeholderTextColor="#666360"
            keyboardAppearance="dark"
            defaultValue={defaultValue}
            onChangeText={value => {
               inputValueRef.current.value = value;
            }}
            onFocus={handleInpuFocus}
            onBlur={handleInpuBlur}
         />
      </Container>
   );
};

export default forwardRef(Input);
