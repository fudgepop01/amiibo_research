```c++
/* WARNING: Unknown calling convention yet parameter storage is locked */
/* app::nfp::param_float(phx::Hash40) */

void param_float(Hash40 param_1)

{
  uint *puVar1;
  int iVar2;
  uint uVar3;
  int iVar4;
  char *pcVar5;
  longlong lVar6;
  char *pcVar7;
  int iVar8;
  int iVar9;
  ulonglong uVar10;

  pcVar5 = *(char **)(*DAT_7104319158 + 0x110); // (char *)0x71043199D8
  if ((*pcVar5 == '\f') && (iVar8 = *(int *)(pcVar5 + 1) + -1, 0 < *(int *)(pcVar5 + 1))) {
    lVar6 = *(longlong *)(*DAT_7104319158 + 0x108);
    iVar9 = 0;
    pcVar7 = "";
    do {
      iVar2 = iVar8 + iVar9;
      if (iVar2 < 0) {
        iVar2 = iVar2 + 1;
      }
      iVar2 = iVar2 >> 1;
      puVar1 = (uint *)(*(longlong *)(lVar6 + 0x28) + (longlong)*(int *)(pcVar5 + 5) +
                       (longlong)iVar2 * 8);
      uVar10 = *(ulonglong *)(*(longlong *)(lVar6 + 0x20) + (ulonglong)*puVar1 * 8);
      if (uVar10 == (ulonglong)param_1) {
        uVar3 = puVar1[1];
        if (uVar3 >> 0x1f != 0) goto LAB_71002eb948;
        pcVar7 = pcVar5 + (longlong)(int)uVar3;
        break;
      }
      iVar4 = iVar2 + -1;
      if (uVar10 <= (ulonglong)param_1) {
        iVar9 = iVar2 + 1;
        iVar4 = iVar8;
      }
      iVar8 = iVar4;
    } while (iVar9 <= iVar8);
  }
  else {
LAB_71002eb948:
    pcVar7 = "";
  }
  if (*pcVar7 == '\b') {
    return;
  }
  return;
}
```