<!-- src/lib/components/ChineseText.svelte -->
<script>
  import { fontPreferences } from '$lib/stores/fontPreferences';
  
  // Props
  export let simplified = '';
  export let traditional = '';
  export let pinyin = '';
  export let showPinyin = $fontPreferences.showPinyin;
  
  // Use appropriate text based on user preference
  $: displayText = $fontPreferences.useTraditional && traditional 
    ? traditional.replace(/ /g, '\u00A0') 
    : simplified.replace(/ /g, '\u00A0');
    
  $: displayPinyin = pinyin.replace(/ /g, '\u00A0');
  
  // Font class based on character set
  $: fontClass = $fontPreferences.useTraditional ? 'font-traditional' : 'font-simplified';
</script>

<div>
  <p class="whitespace-pre-line {fontClass}">{displayText}</p>
  
  {#if showPinyin && pinyin}
    <p class="whitespace-pre-line text-sm text-gray-500 mt-1">{displayPinyin}</p>
  {/if}
</div>

<style>
  .font-simplified {
    font-family: 'Noto Sans SC', sans-serif;
  }
  
  .font-traditional {
    font-family: 'Noto Sans TC', sans-serif;
  }
</style>