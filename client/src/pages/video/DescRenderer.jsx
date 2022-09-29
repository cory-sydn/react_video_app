import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
	min-height: 100px;
  min-width: 200px;
  padding: 0 20px 0 64px;
  display: flex;
  flex-direction: column;
`;

const Text =  styled.div`
  white-space: pre-line;
  font-size: 14px;
  text-align: left;
  line-height: 20px;
  letter-spacing: 0.4px;  
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${(props) => (props.showMore ? "" : "4")};
  display: -moz-box;
  -moz-box-orient: vertical;
  -moz-line-clamp: ${(props) => (props.showMore ? "" : "4")};
  display: -ms-box;
  -ms-box-orient: vertical;
  -ms-line-clamp: ${(props) => (props.showMore ? "" : "4")};
  overflow: ${(props) => (props.showMore ? "" : "hidden")};
  text-overflow: ${(props) => (props.showMore ? "" : "ellipsis")};
  overflow-wrap:${(props) => (props.showMore ? "" : "break-word")};
`;

const Tags = styled.div`
  margin-top: 20px;
`;

const Tag = styled.span`
  font-size: 14px;
	cursor: pointer;
	margin-right: 2px;
	color:#3ea6ff;
`;

const Line = styled.div`
  display: grid;
  justify-content: flex-start;
  padding: 20px 0 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bg};
  z-index: 6;
`;

const More = styled.div`
	color: ${({ theme }) => theme.textSoft};
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	letter-spacing: -0.5px;
`;

const DescRenderer = ({text, tags}) => {
	const [showMore, setShowMore] = useState(false);
  const [showButton, setShowButton] = useState(false)
  const textRef = useRef()

  useEffect(() => {
    const hasClamp = (el) => {
      const { clientHeight, scrollHeight } = el
      return clientHeight !== scrollHeight;
    }

    function checkButtonState (){
      if(textRef.current) {
        setShowButton(hasClamp(textRef.current))
      }
    }
    checkButtonState()
    window.addEventListener("resize", checkButtonState);

    return () => {
      window.removeEventListener("resize", checkButtonState);
    };
  }, [text, textRef])

  return (
    <Wrapper>
      <Text ref={textRef} showMore={showMore}>
        {text}
        <Tags>
          {tags?.map((tag)=> (
            <Tag key={tag } >{"#" + tag}</Tag>
          ))}
        </Tags>
      </Text>
      {showButton && (
        <Line>
          <More onClick={() =>setShowMore(!showMore)} >
            {showMore === true ? ("SHOW LESS") : ("SHOW MORE")}
          </More>
        </Line>
      )}
    </Wrapper>  
  )
}

export default DescRenderer