import React, { useRef, useLayoutEffect, useEffect } from "react";
import PropTypes from 'prop-types';
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

// 전역 ScrollTrigger 설정 제거 - 여기가 문제의 원인

/**
 * 스크롤에 따라 글자가 나타나는 효과를 가진 컴포넌트
 *
 * Props:
 * @param {string} text - 표시할 텍스트 (줄바꿈은 \n으로 표시) [Optional, 기본값: 'Hello Designers,\nYou can make it\nWith Cursor AI.']
 * @param {string} variant - 텍스트 크기 variant [Optional, 기본값: 'h2']
 * @param {string} textColor - 텍스트 색상 [Optional, 기본값: 'inherit']
 * @param {boolean} showMarkers - 마커 표시 여부 [Optional, 기본값: false]
 * @param {boolean} keepVisible - 스크롤 후 텍스트 유지 여부 (false면 스크롤 시 사라짐) [Optional, 기본값: true]
 * @param {string | Element} scroller - 스크롤 이벤트를 감지할 컨테이너 요소 또는 선택자 [Optional, 기본값: window]
 * @param {string} id - 컴포넌트 고유 ID (ScrollTrigger 중첩 방지용) [Optional, 기본값: 랜덤 생성]
 * @param {object} sx - Material-UI sx prop으로 컨테이너 스타일 커스터마이징 [Optional]
 * @param {string} textAlign - 텍스트 정렬 (left, center, right) [Optional, 기본값: 'center']
 * @param {object} typographySx - Typography 컴포넌트의 sx prop [Optional]
 *
 * Example usage:
 * <ScrollStaggerText text="Hello\nWorld" variant="h3" keepVisible={false} id="my-text" scroller="main" />
 */
function ScrollStaggerText({
	text = "Hello Designers,\nYou can make it\nWith Cursor AI.",
	variant = "h2",
	textColor = "inherit",
	showMarkers = false,
	keepVisible = true,
	scroller = window,
	id = `stagger-${Math.random().toString(36).substr(2, 9)}`,
	sx = {},
	textAlign = "center",
	typographySx = {},
}) {
	const containerRef = useRef(null);
	const targetRef = useRef(null);
	const scrollTriggerRef = useRef(null);
	const splitTypeRef = useRef(null);
	const contextRef = useRef(null);

	useEffect(() => {
		// 마커 스타일 직접 추가 (필요한 경우만)
		if (showMarkers && !document.getElementById('fixed-markers-style')) {
			const styleEl = document.createElement('style');
			styleEl.id = 'fixed-markers-style';
			styleEl.innerHTML = `
				.gsap-marker-start, .gsap-marker-end {
					position: fixed !important;
					z-index: 9999 !important;
				}
			`;
			document.head.appendChild(styleEl);
			
			return () => {
				if (document.getElementById('fixed-markers-style')) {
					document.getElementById('fixed-markers-style').remove();
				}
			};
		}
	}, [showMarkers]);

	useLayoutEffect(() => {
		const target = targetRef.current;
		const container = containerRef.current;
		if (!target || !container) return;

		// 컨텍스트 정리
		if (contextRef.current) {
			contextRef.current.revert();
			contextRef.current = null;
		}

		// GSAP 컨텍스트 생성 (범위 제한)
		contextRef.current = gsap.context(() => {
			// SplitType으로 텍스트 분할
			const typeSplit = new SplitType(target, { types: "chars, words" });
			splitTypeRef.current = typeSplit;
			const chars = typeSplit.chars;
			
			// 초기 설정
			gsap.set(chars, { opacity: 0.1 });

			// 마커 고유한 옵션 설정
			const markerOptions = showMarkers ? {
				startColor: "black",
				endColor: "black",
				fontSize: "12px",
				fontWeight: "bold",
				indent: 10,
				// 인스턴스별 고유 클래스명
				className: `st-marker-${id}`
			} : false;

			// ScrollTrigger 생성
			const mainScrollTrigger = ScrollTrigger.create({
				id: id, // 고유 ID 사용
				trigger: container,
				start: "top 100%",
				end: "bottom 100%",
				scrub: 0.5,
				markers: markerOptions,
				onUpdate: (self) => {
					const scrollProgress = self.progress;
					
					chars.forEach((char, index) => {
						const charProgress = index / chars.length;
						const startPosition = 0.1 + charProgress * 0.4;
						const endPosition = startPosition + 0.2;
						
						let opacity;
						if (scrollProgress < startPosition) {
							opacity = 0.1;
						} else if (scrollProgress > endPosition) {
							opacity = keepVisible ? 1 : 0.1;
						} else {
							const relativeProgress = 
								(scrollProgress - startPosition) / (endPosition - startPosition);
							opacity = 0.1 + relativeProgress * 0.9;
						}
						
						gsap.set(char, { opacity });
					});
				},
				invalidateOnRefresh: true,
			});
			
			scrollTriggerRef.current = mainScrollTrigger;
		}, container); // 컨텍스트 범위 지정

		return () => {
			if (contextRef.current) {
				contextRef.current.revert();
				contextRef.current = null;
			}
		};
	}, [text, showMarkers, keepVisible, id]);

	// 줄바꿈(\n)을 <br/>로 변환
	const formattedText = text.split("\n").map((line, index) => (
		<React.Fragment key={index}>
			{line}
			{index < text.split("\n").length - 1 && <br />}
		</React.Fragment>
	));

	return (
		<Box 
			ref={containerRef}
			sx={{
				width: "100%",
				minHeight: "40vh", // 높이 조정
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				py: 6, // 패딩 감소
				overflow: "visible", // 마커가 잘리지 않도록
				position: "relative", // 위치 컨텍스트 생성
				zIndex: 1, // 항상 z-index 설정
				...sx, // 외부에서 전달된 sx 스타일 병합 (기본값을 덮어씀)
			}}
			data-stagger-id={id} // 디버깅 용도
		>
			<Typography
				ref={targetRef}
				variant={variant}
				color={textColor}
				align={textAlign}
				sx={{ 
					fontWeight: "bold",
					...typographySx, // 외부에서 전달된 Typography 스타일 병합
				}}
			>
				{formattedText}
			</Typography>
		</Box>
	);
}

ScrollStaggerText.propTypes = {
	text: PropTypes.string,
	variant: PropTypes.string,
	textColor: PropTypes.string,
	showMarkers: PropTypes.bool,
	keepVisible: PropTypes.bool,
	scroller: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	id: PropTypes.string,
	sx: PropTypes.object,
	textAlign: PropTypes.string,
	typographySx: PropTypes.object,
};

export default ScrollStaggerText;
