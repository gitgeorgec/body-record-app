import { useEffect } from 'react';

export function useFlutterInAppWebView(functionName, data) {
	window.flutter_inappwebview
		.callHandler(functionName, data);
}
